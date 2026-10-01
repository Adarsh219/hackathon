'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { CalendarIcon, Crosshair, Leaf, Loader2, MonitorSmartphone, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { PICKUP_WASTE_TYPES, type Ticket } from '@/lib/cleansync-data'
import { supabase } from '@/lib/supabase'

type SchedulePickupProps = {
  onCreated?: (ticket: Ticket) => void
  onViewTracker?: () => void
  nextNumber?: number
}

export function SchedulePickup({ onCreated, onViewTracker, nextNumber = 105 }: SchedulePickupProps) {
  const [date, setDate] = useState<Date | undefined>()
  const [dateOpen, setDateOpen] = useState(false)
  const [wasteType, setWasteType] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locating, setLocating] = useState(false)

  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  function detectLocation() {
    if (!('geolocation' in navigator)) {
      toast.error('Location is not supported on this device.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords: posCoords }) => {
        setCoords({
          latitude: posCoords.latitude,
          longitude: posCoords.longitude,
        })
        if (!address.trim()) {
          setAddress(`Near ${posCoords.latitude.toFixed(5)}, ${posCoords.longitude.toFixed(5)}`)
        }
        setLocating(false)
        toast.success('Location detected')
      },
      () => {
        setLocating(false)
        toast.error('Could not detect your location. Please enter your address.')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: posCoords }) => {
          setCoords({
            latitude: posCoords.latitude,
            longitude: posCoords.longitude,
          })
        },
        () => {},
        { timeout: 5000 }
      )
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!date || !wasteType || address.trim().length < 5) {
      setError('Please choose a date, waste type, and a full pickup address.')
      return
    }
    setError(null)
    setIsSubmitting(true)

    const pickupDate = format(date, 'yyyy-MM-dd')
    const pickupAddress = address.trim()
    const selectedTypeObj = PICKUP_WASTE_TYPES.find((t) => t.value === wasteType)
    const selectedWasteType = selectedTypeObj?.label || wasteType || 'General'

    // Get current user email
    let currentUserEmail: string | undefined
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      currentUserEmail = sessionData?.session?.user?.email
    } catch {}
    if (!currentUserEmail && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('cleansync_user') || localStorage.getItem('cleansync_session')
        if (raw) {
          const parsed = JSON.parse(raw)
          currentUserEmail = parsed?.email || parsed?.user?.email
        }
      } catch {}
    }
    const finalUserEmail = currentUserEmail || 'citizen@spectrum.local'

    // Latitude and longitude determination
    let currentLatitude = coords?.latitude
    let currentLongitude = coords?.longitude
    if (!currentLatitude || !currentLongitude) {
      const match = pickupAddress.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/)
      if (match) {
        currentLatitude = parseFloat(match[1])
        currentLongitude = parseFloat(match[2])
      }
    }
    const finalLatitude = currentLatitude || 26.8467
    const finalLongitude = currentLongitude || 80.9462

    const generatedId = `ISS-${nextNumber || Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date().toISOString()

    try {
      const { data, error: insertError } = await supabase.from('issues').insert([{
        ticket_id: generatedId,
        title: `Bulk Waste Pickup - ${selectedWasteType || 'General'}`,
        category: 'Pickup Request',
        description: `Scheduled Date: ${pickupDate}. Instructions/Address: ${pickupAddress}`,
        location: pickupAddress,
        status: 'Pending',
        priority: 'Medium',
        user_email: finalUserEmail,
        latitude: finalLatitude,
        longitude: finalLongitude,
        ward: 'Ward 4',
      }])

      if (insertError) {
        setError(insertError.message || 'Failed to book pickup. Please try again.')
        toast.error(insertError.message || 'Failed to book pickup.')
        setIsSubmitting(false)
        return
      }

      const rec = Array.isArray(data) ? data[0] : data
      const trackingTicket = rec?.ticket_id || rec?.id || generatedId

      // Show success toast/alert: "Pickup request booked! Tracking Ticket: ISS-XXXX"
      toast.success(`Pickup request booked! Tracking Ticket: ${trackingTicket}`)

      // Add to ticket tracker
      if (onCreated) {
        onCreated({
          id: trackingTicket,
          category: 'Pickup Request',
          location: pickupAddress,
          description: `Scheduled Date: ${pickupDate}. Instructions/Address: ${pickupAddress}`,
          priority: 'medium',
          createdAt: now,
          stepIndex: 0,
          events: [
            {
              at: now,
              note: `Pickup scheduled for ${format(date, 'EEEE, MMM d, yyyy')}. Instructions: ${pickupAddress}`,
            },
            null,
            null,
            null,
          ],
        })
      }

      // Reset form fields
      setDate(undefined)
      setWasteType(null)
      setAddress('')

      // Automatically switch the active tab to "Track My Complaints"
      if (onViewTracker) {
        onViewTracker()
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while booking pickup.')
      toast.error('Failed to book pickup.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Schedule Bulk Pickup</CardTitle>
          <CardDescription>Request a free doorstep pickup for bulky e-waste or garden waste.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pickup-date">Pickup Date</Label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        id="pickup-date"
                        type="button"
                        variant="outline"
                        className={cn('h-10 w-full justify-start font-normal', !date && 'text-muted-foreground')}
                      />
                    }
                  >
                    <CalendarIcon aria-hidden="true" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        setDateOpen(false)
                      }}
                      disabled={[{ before: tomorrow }, { dayOfWeek: [0] }]}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pickup-type">Waste Type</Label>
                <Select items={PICKUP_WASTE_TYPES} value={wasteType} onValueChange={(v) => setWasteType(v as string | null)}>
                  <SelectTrigger id="pickup-type" className="h-10 w-full">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PICKUP_WASTE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pickup-address">Pickup Address</Label>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer disabled:opacity-50"
                >
                  {locating ? <Loader2 className="size-3 animate-spin" /> : <Crosshair className="size-3" />}
                  <span>Use current location</span>
                </button>
              </div>
              <Textarea
                id="pickup-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / flat number, street, landmark"
                autoComplete="street-address"
                rows={3}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 w-full text-base sm:w-auto sm:self-end sm:px-8 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" aria-hidden="true" />
                  Booking Pickup…
                </>
              ) : (
                <>
                  <Truck aria-hidden="true" className="mr-2" />
                  Book Pickup
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-3 rounded-2xl border bg-accent/60 p-5">
        <h2 className="text-sm font-semibold text-accent-foreground">Before your pickup</h2>
        <ul className="flex flex-col gap-3 text-sm text-foreground/80">
          <li className="flex gap-3">
            <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Wipe personal data from devices and remove batteries where possible.
          </li>
          <li className="flex gap-3">
            <Leaf className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Bundle branches under 1.2 m and bag loose leaves.
          </li>
          <li className="flex gap-3">
            <Truck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Keep items at the gate by 8 AM. Pickups run Monday to Saturday.
          </li>
        </ul>
      </aside>
    </div>
  )
}
