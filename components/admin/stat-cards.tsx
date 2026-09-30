import { AlertTriangle, ClipboardList, Clock, TrendingDown, TrendingUp, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATS = [
  {
    label: 'Total Grievances',
    value: '128',
    note: '+12% from yesterday',
    icon: ClipboardList,
    tone: 'neutral',
    trend: 'up',
  },
  { label: 'Pending Action', value: '24', note: 'Urgent attention required', icon: AlertTriangle, tone: 'warn' },
  { label: 'In Progress', value: '38', note: 'Assigned to sanitation trucks', icon: Truck, tone: 'info' },
  {
    label: 'Avg. Resolution Time',
    value: '4.2',
    unit: 'Hours',
    note: '-18% improved',
    icon: Clock,
    tone: 'good',
    trend: 'down',
  },
] as const

const STAT_TONE = {
  neutral: 'text-slate-700 bg-slate-100',
  warn: 'text-amber-800 bg-amber-50 border border-amber-200/80',
  info: 'text-blue-700 bg-blue-50 border border-blue-200/80',
  good: 'text-emerald-700 bg-emerald-50 border border-emerald-200/80',
}

export function StatCards() {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STATS.map((s) => {
        const Icon = s.icon
        const Trend = 'trend' in s ? (s.trend === 'up' ? TrendingUp : TrendingDown) : null
        return (
          <div
            key={s.label}
            className="p-6 flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-xl shadow-2xs',
                  STAT_TONE[s.tone],
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>

            {/* Value row */}
            <div className="mt-3 mb-2 flex items-baseline">
              <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {s.value}
              </span>
              {'unit' in s && (
                <span className="text-sm font-normal text-slate-500 ml-1.5">
                  {s.unit}
                </span>
              )}
            </div>

            {/* Subtitle row */}
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                s.tone === 'warn' ? 'text-amber-700' : Trend ? 'text-emerald-600' : 'text-slate-500',
              )}
            >
              {Trend && <Trend className="size-3.5" aria-hidden="true" />}
              <span>{s.note}</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}
