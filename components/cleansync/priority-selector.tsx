'use client'

import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/cleansync-data'

const OPTIONS: { value: Priority; label: string; hint: string; dot: string; active: string }[] = [
  {
    value: 'low',
    label: 'Low',
    hint: 'Can wait a few days',
    dot: 'bg-slate-400',
    active: 'border-slate-400 bg-slate-50 ring-slate-300',
  },
  {
    value: 'medium',
    label: 'Medium',
    hint: 'Needs attention soon',
    dot: 'bg-amber-500',
    active: 'border-amber-400 bg-amber-50 ring-amber-200',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    hint: 'Health or safety risk',
    dot: 'bg-red-500',
    active: 'border-red-400 bg-red-50 ring-red-200',
  },
]

type PrioritySelectorProps = {
  value: Priority
  onChange: (value: Priority) => void
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">Priority</legend>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer flex-col gap-1 rounded-xl border bg-card p-3 transition-all has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                selected ? cn('ring-2', opt.active) : 'hover:bg-muted/60',
              )}
            >
              <input
                type="radio"
                name="priority"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className="flex items-center gap-2 text-sm font-medium">
                <span className={cn('size-2.5 rounded-full', opt.dot)} aria-hidden="true" />
                {opt.label}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">{opt.hint}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
