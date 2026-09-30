import { AlertTriangle, ClipboardList, Clock, TrendingDown, TrendingUp, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Total Grievances', value: '128', note: '+12% from yesterday', icon: ClipboardList, tone: 'neutral', trend: 'up' },
  { label: 'Pending Action', value: '24', note: 'Urgent attention required', icon: AlertTriangle, tone: 'warn' },
  { label: 'In Progress', value: '38', note: 'Assigned to sanitation trucks', icon: Truck, tone: 'info' },
  { label: 'Avg. Resolution Time', value: '4.2', unit: 'Hours', note: '-18% improved', icon: Clock, tone: 'good', trend: 'down' },
] as const

const TONE = {
  neutral: 'text-foreground bg-muted',
  warn: 'text-amber-400 bg-amber-400/10',
  info: 'text-sky-400 bg-sky-400/10',
  good: 'text-primary bg-primary/10',
}

export function StatCards() {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map((s) => {
        const Icon = s.icon
        const Trend = 'trend' in s ? (s.trend === 'up' ? TrendingUp : TrendingDown) : null
        return (
          <Card key={s.label} className="gap-0 py-0">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <span className={cn('flex size-7 items-center justify-center rounded-md', TONE[s.tone])}>
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{s.value}</span>
                {'unit' in s && <span className="text-sm text-muted-foreground">{s.unit}</span>}
              </div>
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  s.tone === 'warn' ? 'text-amber-400' : Trend ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {Trend && <Trend className="size-3.5" aria-hidden="true" />}
                {s.note}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
