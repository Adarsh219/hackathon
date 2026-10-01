'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, Crosshair, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISSUE_CATEGORIES, type IssueCategory, type Priority, type Ticket, stripAuditTags } from '@/lib/cleansync-data'
import { supabase } from '@/lib/supabase'
import { verifyCameraMetadata } from '@/app/report/page'
import { PhotoDropzone } from './photo-dropzone'
import { PrioritySelector } from './priority-selector'

type ReportIssueFormProps = {
  onCreated?: (ticket: Ticket) => void
  nextNumber?: number
  onViewTracker?: () => void
}

export function ReportIssueForm({ onCreated, nextNumber = 105, onViewTracker }: ReportIssueFormProps) {
  const [category, setCategory] = useState<IssueCategory | null>(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [priority, setPriority] = useState<Priority>('medium')
  let [coords, setCoords] = useState<{ lat?: number; lng?: number; latitude?: number; longitude?: number } | null>(null)
  const [title, setTitle] = useState('')
  const [ward, setWard] = useState('Ward 4')
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isDeviceVerified, setIsDeviceVerified] = useState<boolean>(false)
  const [locating, setLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ category?: string; location?: string }>({})

  useEffect(() => {
    let isMounted = true
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('cleansync_user') : null
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user && isMounted) {
            setUser(data.user)
          }
        })
      }
    } catch {}
    return () => {
      isMounted = false
    }
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      let verified = false
      try {
        verified = await verifyCameraMetadata(file)
      } catch {
        verified = false
      }
      setIsDeviceVerified(verified)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function detectLocation() {
    if (!('geolocation' in navigator)) {
      toast.error('Location is not supported on this device.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: posCoords }) => {
        setCoords({
          lat: posCoords.latitude,
          lng: posCoords.longitude,
          latitude: posCoords.latitude,
          longitude: posCoords.longitude,
        })
        setLocation(`Near ${posCoords.latitude.toFixed(5)}, ${posCoords.longitude.toFixed(5)}`)
        setErrors((e) => ({ ...e, location: undefined }))
        setLocating(false)
      },
      () => {
        toast.error('Could not detect your location. Please type it in.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    const nextErrors: typeof errors = {}
    if (!category) nextErrors.category = 'Please choose an issue category.'
    if (location.trim().length < 3) nextErrors.location = 'Please enter a location.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !category) return

    setIsSubmitting(true)

    if (!coords?.lat || !coords?.lng) {
      const match = location.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/)
      if (match) {
        coords = {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        }
      }
    }

    const now = new Date().toISOString()
    const id = `ISS-${nextNumber}`
    const auditTag = isDeviceVerified
      ? '[VERIFIED: Hardware Live Capture]'
      : '[FLAGGED: Missing Camera EXIF]'
    const cleanDesc = stripAuditTags(description)
    const verifiedDescription = cleanDesc ? `${cleanDesc} ${auditTag}` : auditTag

    try {
      const { data, error } = await supabase.from('issues').insert([
        {
          title: title || `${category} Report`,
          category: category,
          description: verifiedDescription,
          location: location || ward || 'Ward 4',
          ward: ward || 'Ward 4',
          latitude: coords?.lat ?? 26.8467,
          longitude: coords?.lng ?? 80.9462,
          status: 'Pending',
          priority: priority || 'Medium',
          image_url: imageUrl || null,
          user_email: user?.email || 'citizen@spectrum.local'
        }
      ])

      if (error) {
        setSubmitError(error.message || 'Error inserting issue into Supabase.')
        toast.error(error.message || 'Failed to submit grievance.')
        setIsSubmitting(false)
        return
      }

      // Success

      if (onCreated) {
        onCreated({
          id,
          category: category || 'illegal-dumping',
          location: location.trim(),
          description: cleanDesc,
          priority,
          createdAt: now,
          stepIndex: 0,
          events: [
            {
              at: now,
              note: (photos.length > 0 || imageUrl)
                ? `Complaint submitted with photo evidence.`
                : 'Complaint submitted via Citizen Portal and recorded to database.',
            },
            null,
            null,
            null,
          ],
        })
      }

      // Reset form inputs
      setCategory(null)
      setLocation('')
      setDescription('')
      setPhotos([])
      setImageUrl(null)
      setIsDeviceVerified(false)
      setPriority('medium')
      setCoords(null)
      setErrors({})
      setSubmitSuccess(true)
      toast.success('Grievance logged successfully!')
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred while saving grievance.')
      toast.error('Failed to log grievance.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Report Waste or Illegal Dumping</CardTitle>
        <CardDescription>
          Share the details and our sanitation team will take it from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Alert Banner */}
        {submitSuccess && (
          <div
            role="status"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-emerald-900">Grievance logged successfully!</p>
                <p className="mt-0.5 text-xs text-emerald-700 leading-relaxed">
                  Your issue has been recorded in the database and queued for municipal crew assignment.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onViewTracker && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onViewTracker}
                  className="border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 text-xs h-8"
                >
                  Track Status →
                </Button>
              )}
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900 text-sm px-1.5 py-0.5"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-rose-900">Could not submit grievance</p>
                <p className="mt-0.5 text-xs text-rose-700 leading-relaxed">{submitError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-rose-700 hover:text-rose-900 text-sm px-1.5 py-0.5 shrink-0"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="issue-category">Issue Category</Label>
              <Select
                items={ISSUE_CATEGORIES}
                value={category}
                onValueChange={(value) => {
                  setCategory(value as IssueCategory | null)
                  setErrors((e) => ({ ...e, category: undefined }))
                }}
              >
                <SelectTrigger
                  id="issue-category"
                  className="h-10 w-full"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? 'issue-category-error' : undefined}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p id="issue-category-error" className="text-sm text-destructive">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="issue-location">Location</Label>
              <div className="relative">
                <Input
                  id="issue-location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setErrors((er) => ({ ...er, location: undefined }))
                  }}
                  placeholder="Street, landmark or area"
                  autoComplete="street-address"
                  className="h-10 pr-11"
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? 'issue-location-error' : undefined}
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={detectLocation}
                  disabled={locating}
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 text-primary hover:bg-accent hover:text-accent-foreground"
                  aria-label="Detect current location"
                  title="Detect current location"
                >
                  {locating ? <Loader2 className="animate-spin" /> : <Crosshair />}
                </Button>
              </div>
              {errors.location && (
                <p id="issue-location-error" className="text-sm text-destructive">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="issue-description">Description</Label>
            <Textarea
              id="issue-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you see — type of waste, how long it has been there, any hazards..."
              rows={4}
              maxLength={500}
              className="min-h-28 resize-y"
            />
            <p className="text-right text-xs text-muted-foreground tabular-nums">{description.length}/500</p>
          </div>

          <PhotoDropzone
            files={photos}
            onChange={setPhotos}
            onImageChange={handleImageChange}
            onBase64Change={setImageUrl}
          />

          <PrioritySelector value={priority} onChange={setPriority} />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 w-full text-base sm:w-auto sm:self-end sm:px-8 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" aria-hidden="true" />
                Submitting Grievance…
              </>
            ) : (
              <>
                <Send aria-hidden="true" className="mr-2" />
                Submit Ticket
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
