'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { CalendarIcon, Leaf, MonitorSmartphone, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { PICKUP_WASTE_TYPES } from '@/lib/cleansync-data'

export function SchedulePickup() {
  const [date, setDate] = useState<Date | undefined>()
  const [dateOpen, setDateOpen] = useState(false)
  const [wasteType, setWasteType] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)

  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!date || !wasteType || address.trim().length < 5) {
      setError('Please choose a date, waste type, and a full pickup address.')
      return
    }
    setError(null)
    toast.success('Pickup booked', {
      description: `A crew will arrive on ${format(date, 'EEEE, MMM d')} between 8 AM and 1 PM.`,
    })
    setDate(undefined)
    setWasteType(null)
    setAddress('')
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
              <Label htmlFor="pickup-address">Pickup Address</Label>
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

            <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto sm:self-end sm:px-8">
              <Truck aria-hidden="true" />
              Book Pickup
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
