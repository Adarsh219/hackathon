'use client'

import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIMELINE_STEPS, type Ticket } from '@/lib/cleansync-data'

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function TicketTimeline({ ticket }: { ticket: Ticket }) {
  const [selected, setSelected] = useState(ticket.stepIndex)
  const event = ticket.events[selected]
  const progress = (ticket.stepIndex / (TIMELINE_STEPS.length - 1)) * 100

  return (
    <div className="flex flex-col gap-4">
      <div className="relative px-2">
        <div className="absolute top-4 right-[12.5%] left-[12.5%] h-0.5 rounded-full bg-border" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <ol className="relative grid grid-cols-4" aria-label={`Progress for ticket ${ticket.id}`}>
          {TIMELINE_STEPS.map((step, i) => {
            const done = i < ticket.stepIndex || (i === ticket.stepIndex && i === TIMELINE_STEPS.length - 1)
            const current = i === ticket.stepIndex && !done
            const reached = i <= ticket.stepIndex
            return (
              <li key={step.key} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                  aria-current={current ? 'step' : undefined}
                  className="group flex flex-col items-center gap-2 rounded-lg px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border-2 bg-card text-xs font-semibold transition-all',
                      done && 'border-primary bg-primary text-primary-foreground',
                      current && 'border-primary text-primary ring-4 ring-primary/15',
                      !reached && 'border-border text-muted-foreground',
                      selected === i && 'scale-110',
                    )}
                  >
                    {done ? <Check className="size-4" aria-hidden="true" /> : current ? (
                      <span className="size-2.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-center text-[11px] leading-tight font-medium text-balance sm:text-xs',
                      reached ? 'text-foreground' : 'text-muted-foreground',
                      selected === i && 'text-primary',
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="rounded-xl bg-muted/60 p-3 text-sm" aria-live="polite">
        <p className="font-medium">{TIMELINE_STEPS[selected].label}</p>
        {event ? (
          <>
            <p className="mt-0.5 text-muted-foreground">{event.note}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" aria-hidden="true" />
              <time dateTime={event.at}>{timeFormatter.format(new Date(event.at))}</time>
            </p>
          </>
        ) : (
          <p className="mt-0.5 text-muted-foreground">
            {"This stage hasn't started yet. We'll notify you when it does."}
          </p>
        )}
      </div>
    </div>
  )
}
