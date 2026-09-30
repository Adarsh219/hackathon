'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Flame,
  Loader,
  MoreHorizontal,
  Recycle,
  Search,
  Send,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  CREWS,
  HOTSPOTS,
  INITIAL_TICKETS,
  WARDS,
  formatReported,
  type AdminStatus,
  type AdminTicket,
} from '@/lib/admin-data'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------
 * 1. Admin Header
 * ----------------------------------------------------------------------- */
export type AdminHeaderProps = {
  query: string
  onQueryChange: (v: string) => void
  ward: string
  onWardChange: (v: string) => void
}

export function AdminHeader({ query, onQueryChange, ward, onWardChange }: AdminHeaderProps) {
  const [live, setLive] = useState(true)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Recycle className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              CleanSync <span className="font-semibold text-slate-900">Admin Operations</span>
            </h1>
            <span className="text-xs text-slate-500">Municipal Waste Management Authority</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:flex-initial">
          <div className="relative w-full max-w-xs sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="admin-search" className="sr-only">
              Search tickets
            </label>
            <Input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search ticket, category, location…"
              className="h-9 w-full rounded-lg border-slate-200 bg-white pl-9 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          <Select items={WARDS} value={ward} onValueChange={(v) => onWardChange((v as string) ?? 'all')}>
            <SelectTrigger
              aria-label="Filter by ward"
              className="h-9 w-40 rounded-lg border-slate-200 bg-white text-sm text-slate-900 shadow-xs focus:ring-emerald-500/20"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg">
              {WARDS.map((w) => (
                <SelectItem
                  key={w.value}
                  value={w.value}
                  className="text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs">
            <span className="relative flex size-2" aria-hidden="true">
              {live && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              )}
              <span
                className={cn('relative inline-flex size-2 rounded-full', live ? 'bg-emerald-500' : 'bg-slate-400')}
              />
            </span>
            <span className="text-xs whitespace-nowrap" aria-live="polite">
              <span className="text-slate-500">System Status: </span>
              <span className={cn('font-medium', live ? 'text-emerald-600' : 'text-slate-500')}>
                {live ? 'Online (4 Active Crews)' : 'Paused'}
              </span>
            </span>
            <Switch
              checked={live}
              onCheckedChange={setLive}
              aria-label="Toggle live monitoring"
              className="data-state-checked:bg-emerald-600"
            />
          </div>

          <Link
            href="/citizen"
            className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline"
          >
            Citizen Portal
          </Link>
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------
 * 2. Metric Stat Cards
 * ----------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------
 * 3. Grievance Table
 * ----------------------------------------------------------------------- */
const STATUS_STYLE: Record<AdminStatus, string> = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-800',
  'In Progress': 'border-blue-200 bg-blue-50 text-blue-700',
  Dispatched: 'border-purple-200 bg-purple-50 text-purple-700',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export type GrievanceTableProps = {
  tickets: AdminTicket[]
  total: number
  onUpdate: (id: string, status: AdminStatus, crew?: string) => void
}

export function GrievanceTable({ tickets, total, onUpdate }: GrievanceTableProps) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base font-semibold text-slate-900">Incoming Waste Issues</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Showing {tickets.length} of {total} tickets
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="rounded-full border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600 shadow-2xs"
        >
          Live queue
        </Badge>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="w-full text-slate-900">
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="pl-5 text-xs font-semibold text-slate-600">Ticket ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Category</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Location / Ward</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Date Reported</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
              <TableHead className="pr-5 text-right text-xs font-semibold text-slate-600">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                  No tickets match your filters.
                </TableCell>
              </TableRow>
            )}
            {tickets.map((t) => {
              const { date, time } = formatReported(t.reportedAt)
              return (
                <TableRow key={t.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
                  <TableCell className="pl-5 font-mono text-xs font-semibold text-slate-900">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-800">{t.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="max-w-56 truncate text-sm font-medium text-slate-900">{t.location}</span>
                      <span className="text-xs text-slate-500">{t.ward}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium tabular-nums text-slate-700">{date}</span>
                      <span className="text-xs tabular-nums text-slate-500">{time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-2xs',
                          STATUS_STYLE[t.status],
                        )}
                      >
                        {t.status}
                      </Badge>
                      {t.crew && t.status !== 'Resolved' && (
                        <span className="text-[11px] font-medium text-slate-500">{t.crew}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${t.id}`}
                            className="size-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent
                        align="end"
                        className="w-52 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="font-mono text-xs font-semibold text-slate-500">
                            {t.id}
                          </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem
                          disabled={t.status === 'In Progress'}
                          onClick={() => onUpdate(t.id, 'In Progress')}
                          className="text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Loader className="size-4 text-slate-500" aria-hidden="true" />
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={t.status === 'Resolved'}
                          onClick={() => onUpdate(t.id, 'Resolved')}
                          className="text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                            <Send className="size-4 text-slate-500" aria-hidden="true" />
                            Dispatch Team
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg">
                            {CREWS.map((c) => (
                              <DropdownMenuItem
                                key={c.id}
                                onClick={() => onUpdate(t.id, 'Dispatched', c.name)}
                                className="text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                              >
                                {c.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------
 * 4. Hotspots Card
 * ----------------------------------------------------------------------- */
const MAX_HOTSPOT = 20

export function HotspotsCard() {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base font-semibold text-slate-900">Identified Waste Hotspots</CardTitle>
          <CardDescription className="text-xs text-slate-500">Complaint density · last 7 days</CardDescription>
        </div>
        <Flame className="size-4 text-amber-500" aria-hidden="true" />
      </CardHeader>
      <CardContent className="p-5">
        <ol className="flex flex-col gap-4">
          {HOTSPOTS.map((h, i) => {
            const pct = Math.round((h.complaints / MAX_HOTSPOT) * 100)
            return (
              <li key={h.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[10px] font-semibold text-slate-600">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium text-slate-900">{h.name}</span>
                    <span className="hidden text-xs text-slate-500 xl:inline">{h.ward}</span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-slate-500">
                    <span className="font-semibold text-slate-900">{h.complaints}</span> complaints
                  </span>
                </div>
                <Progress
                  value={pct}
                  aria-label={`${h.name} density ${pct}%`}
                  className={cn(
                    '[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-slate-100',
                    i === 0
                      ? '[&_[data-slot=progress-indicator]]:bg-amber-500'
                      : '[&_[data-slot=progress-indicator]]:bg-emerald-600',
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

/* -------------------------------------------------------------------------
 * 5. Quick Dispatch Card
 * ----------------------------------------------------------------------- */
const CREW_ITEMS = CREWS.map((c) => ({ value: c.id, label: c.name }))
const ZONE_ITEMS = HOTSPOTS.map((h) => ({ value: h.name, label: `${h.name} (${h.complaints})` }))

type Assignment = { crew: string; zone: string }

export function QuickDispatchCard() {
  const [crewId, setCrewId] = useState<string | null>(null)
  const [zone, setZone] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const crew = CREWS.find((c) => c.id === crewId)

  function dispatch() {
    if (!crew || !zone) return
    setAssignments((prev) => [{ crew: crew.name, zone }, ...prev.filter((a) => a.crew !== crew.name)].slice(0, 3))
    toast.success(`${crew.name} dispatched`, { description: `En route to ${zone}` })
    setCrewId(null)
    setZone(null)
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-slate-200 bg-white px-5 py-4">
        <CardTitle className="text-base font-semibold text-slate-900">Quick Dispatch</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Assign an active crew to a high-density zone
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispatch-crew" className="text-xs font-medium text-slate-700">
            Sanitation crew
          </Label>
          <Select items={CREW_ITEMS} value={crewId} onValueChange={(v) => setCrewId(v as string | null)}>
            <SelectTrigger
              id="dispatch-crew"
              className="h-9 w-full rounded-lg border-slate-200 bg-white text-sm text-slate-900 shadow-xs focus:ring-emerald-500/20"
            >
              <SelectValue placeholder="Select active crew" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg">
              {CREWS.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  className="text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {crew && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="size-3 text-slate-400" aria-hidden="true" />
              {crew.members} members · {crew.vehicle}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispatch-zone" className="text-xs font-medium text-slate-700">
            Target zone
          </Label>
          <Select items={ZONE_ITEMS} value={zone} onValueChange={(v) => setZone(v as string | null)}>
            <SelectTrigger
              id="dispatch-zone"
              className="h-9 w-full rounded-lg border-slate-200 bg-white text-sm text-slate-900 shadow-xs focus:ring-emerald-500/20"
            >
              <SelectValue placeholder="Select hotspot" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg">
              {ZONE_ITEMS.map((z) => (
                <SelectItem
                  key={z.value}
                  value={z.value}
                  className="text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {z.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={dispatch}
          disabled={!crew || !zone}
          className="h-9.5 w-full rounded-lg bg-emerald-600 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50"
        >
          <Send className="size-4" aria-hidden="true" />
          Dispatch Crew
        </Button>

        {assignments.length > 0 && (
          <ul className="flex flex-col gap-2 border-t border-slate-100 pt-3" aria-label="Recent dispatches">
            {assignments.map((a) => (
              <li key={a.crew} className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-900">{a.crew}</span>
                <span className="truncate text-slate-500">{'→ '}{a.zone}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------
 * 6. Main Admin Dashboard Component
 * ----------------------------------------------------------------------- */
export function AdminDashboard() {
  const [tickets, setTickets] = useState<AdminTicket[]>(INITIAL_TICKETS)
  const [query, setQuery] = useState('')
  const [ward, setWard] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter((t) => {
      if (ward !== 'all' && t.ward !== ward) return false
      if (!q) return true
      return [t.id, t.category, t.location, t.ward].some((v) => v.toLowerCase().includes(q))
    })
  }, [tickets, query, ward])

  function updateStatus(id: string, status: AdminStatus, crew?: string) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, crew: crew ?? t.crew } : t)))
    toast.success(`${id} updated`, { description: crew ? `${status} · ${crew}` : `Status set to ${status}` })
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
      <AdminHeader query={query} onQueryChange={setQuery} ward={ward} onWardChange={setWard} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <StatCards />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          <GrievanceTable tickets={filtered} total={tickets.length} onUpdate={updateStatus} />
          <div className="flex flex-col gap-6">
            <HotspotsCard />
            <QuickDispatchCard />
          </div>
        </div>
      </main>
    </div>
  )
}
