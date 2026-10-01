'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, ChevronDown, MapPin, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { categoryLabel, statusFromStep, type Ticket, type TicketStatus } from '@/lib/cleansync-data'
import { TicketTimeline } from './ticket-timeline'

const STATUS_STYLES: Record<TicketStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'border-amber-200 bg-amber-50 text-amber-800' },
  'in-progress': { label: 'In Progress', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  resolved: { label: 'Resolved', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

type TrackComplaintsProps = {
  tickets: Ticket[]
  highlightId: string | null
}

export function TrackComplaints({ tickets, highlightId }: TrackComplaintsProps) {
  const [openId, setOpenId] = useState<string | null>(highlightId ?? tickets[0]?.id ?? null)

  useEffect(() => {
    if (highlightId) {
      setOpenId(highlightId)
    }
  }, [highlightId])

  const counts = tickets.reduce(
    (acc, t) => {
      acc[statusFromStep(t.stepIndex)] += 1
      return acc
    },
    { pending: 0, 'in-progress': 0, resolved: 0 } as Record<TicketStatus, number>,
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {(Object.keys(STATUS_STYLES) as TicketStatus[]).map((status) => (
          <div key={status} className="rounded-xl border bg-card p-3 sm:p-4">
            <p className="text-2xl font-semibold tabular-nums">{counts[status]}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{STATUS_STYLES[status].label}</p>
          </div>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {tickets.map((ticket) => {
          const status = STATUS_STYLES[statusFromStep(ticket.stepIndex)]
          const open = openId === ticket.id
          const panelId = `ticket-panel-${ticket.id}`
          return (
            <li key={ticket.id}>
              <Card
                className={cn(
                  'gap-0 rounded-2xl py-0 transition-shadow',
                  open && 'shadow-md ring-1 ring-primary/20',
                  highlightId === ticket.id && 'ring-2 ring-primary/40',
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : ticket.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full flex-col gap-3 rounded-2xl p-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold">#{ticket.id}</span>
                      {ticket.category === 'Pickup Request' || ticket.category?.toLowerCase() === 'pickup request' ? (
                        <Badge className="rounded-md border border-emerald-300 bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 shadow-2xs">
                          <Truck className="size-3 mr-1 inline-block shrink-0" aria-hidden="true" />
                          Scheduled Pickup
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-md">
                          {categoryLabel(ticket.category)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('rounded-full', status.className)}>
                        {status.label}
                      </Badge>
                      <ChevronDown
                        className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-5">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{ticket.location}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <CalendarDays className="size-4" aria-hidden="true" />
                      <time dateTime={ticket.createdAt}>{dateFormatter.format(new Date(ticket.createdAt))}</time>
                    </span>
                  </div>
                </button>
                {open && (
                  <div id={panelId} className="border-t px-4 pt-4 pb-5 sm:px-5">
                    {ticket.description && (
                      <p className="mb-4 text-sm text-pretty text-foreground/80">{ticket.description}</p>
                    )}
                    <TicketTimeline ticket={ticket} />
                  </div>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
