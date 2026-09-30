import { Flame } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { HOTSPOTS } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

const MAX = 20

export function HotspotsCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b px-4 py-3 [.border-b]:pb-3">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-semibold">Identified Waste Hotspots</CardTitle>
          <CardDescription className="text-xs">Complaint density · last 7 days</CardDescription>
        </div>
        <Flame className="size-4 text-amber-400" aria-hidden="true" />
      </CardHeader>
      <CardContent className="p-4">
        <ol className="flex flex-col gap-3.5">
          {HOTSPOTS.map((h, i) => {
            const pct = Math.round((h.complaints / MAX) * 100)
            return (
              <li key={h.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{h.name}</span>
                    <span className="hidden text-xs text-muted-foreground xl:inline">{h.ward}</span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    <span className="font-semibold text-foreground">{h.complaints}</span> complaints
                  </span>
                </div>
                <Progress
                  value={pct}
                  aria-label={`${h.name} density ${pct}%`}
                  className={cn(
                    '[&_[data-slot=progress-track]]:h-1.5',
                    i === 0 && '[&_[data-slot=progress-indicator]]:bg-amber-400',
                  )}
                />
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
