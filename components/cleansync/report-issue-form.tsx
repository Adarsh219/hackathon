'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Crosshair, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISSUE_CATEGORIES, type IssueCategory, type Priority, type Ticket } from '@/lib/cleansync-data'
import { PhotoDropzone } from './photo-dropzone'
import { PrioritySelector } from './priority-selector'

type ReportIssueFormProps = {
  onCreated: (ticket: Ticket) => void
  nextNumber: number
}

export function ReportIssueForm({ onCreated, nextNumber }: ReportIssueFormProps) {
  const [category, setCategory] = useState<IssueCategory | null>(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [priority, setPriority] = useState<Priority>('medium')
  const [locating, setLocating] = useState(false)
  const [errors, setErrors] = useState<{ category?: string; location?: string }>({})

  function detectLocation() {
    if (!('geolocation' in navigator)) {
      toast.error('Location is not supported on this device.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(`Near ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`)
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!category) nextErrors.category = 'Please choose an issue category.'
    if (location.trim().length < 3) nextErrors.location = 'Please enter a location.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !category) return

    const now = new Date().toISOString()
    const id = `ISS-${nextNumber}`
    onCreated({
      id,
      category,
      location: location.trim(),
      description: description.trim(),
      priority,
      createdAt: now,
      stepIndex: 0,
      events: [
        {
          at: now,
          note: photos.length
            ? `Complaint submitted with ${photos.length} photo${photos.length > 1 ? 's' : ''}.`
            : 'Complaint submitted via Citizen Portal.',
        },
        null,
        null,
        null,
      ],
    })
    toast.success(`Ticket #${id} submitted`, {
      description: 'We will notify you as soon as a crew is assigned.',
    })
    setCategory(null)
    setLocation('')
    setDescription('')
    setPhotos([])
    setPriority('medium')
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

          <PhotoDropzone files={photos} onChange={setPhotos} />

          <PrioritySelector value={priority} onChange={setPriority} />

          <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto sm:self-end sm:px-8">
            <Send aria-hidden="true" />
            Submit Ticket
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
