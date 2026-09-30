import Image from 'next/image'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Flame,
  LocateFixed,
  Send,
  TrendingDown,
  TrendingUp,
  Truck,
} from 'lucide-react'

export function GeoReportVisual() {
  return (
    <div className="rounded-xl bg-card/80 p-2" aria-hidden="true">
      <Image
        src="/images/feature-geolocation.png"
        alt=""
        width={1408}
        height={768}
        className="h-auto w-full rounded-lg"
      />
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-primary/30 bg-secondary/60 px-3 py-2.5">
        <LocateFixed className="size-4 shrink-0 text-primary" />
        <p className="min-w-0 flex-1 truncate text-xs text-foreground">
          <span className="font-medium">Location verified</span>
          <span className="text-muted-foreground"> · Sector 4 Market, Ward 4 · ±4 m accuracy</span>
        </p>
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
      </div>
    </div>
  )
}

export function QuickLogVisual() {
  const categories = ['Illegal Dumping', 'Overflowing Bin', 'Dead Animal', 'E-Waste']
  const priorities = [
    { label: 'Low', dot: 'bg-muted-foreground' },
    { label: 'Medium', dot: 'bg-warning', active: true },
    { label: 'Urgent', dot: 'bg-destructive' },
  ]
  return (
    <PanelShell title="Report Waste or Illegal Dumping" subtitle="Citizen Portal · 3 quick steps">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">1. Issue category</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <span
                key={c}
                className={`rounded-full border px-3 py-1 text-xs ${
                  i === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">2. Photo</p>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-input bg-card px-3 py-3 text-xs text-muted-foreground">
            <Camera className="size-4 text-primary" />
            dumping-site.jpg attached · GPS tagged
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">3. Priority</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {priorities.map((p) => (
              <span
                key={p.label}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-foreground ${
                  p.active ? 'border-warning bg-warning/10' : 'border-border bg-card'
                }`}
              >
                <span className={`size-2 rounded-full ${p.dot}`} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
        <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground">
          <Send className="size-4" />
          Submit Ticket
        </span>
      </div>
    </PanelShell>
  )
}

function PanelShell({ title, subtitle, badge, children }: { title: string; subtitle: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-card/80 p-5 md:p-6" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {badge}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export function MetricsVisual() {
  const metrics = [
    { label: 'Total Grievances', value: '128', note: '+12% from yesterday', icon: ClipboardList, tone: 'text-primary', NoteIcon: TrendingUp },
    { label: 'Pending Action', value: '24', note: 'Urgent attention required', icon: AlertTriangle, tone: 'text-warning', NoteIcon: null },
    { label: 'In Progress', value: '38', note: 'Assigned to sanitation trucks', icon: Truck, tone: 'text-muted-foreground', NoteIcon: null },
    { label: 'Avg. Resolution', value: '4.2', unit: 'hrs', note: '-18% improved', icon: Clock, tone: 'text-primary', NoteIcon: TrendingDown },
  ]
  return (
    <PanelShell
      title="Operations Overview"
      subtitle="City-wide sanitation health"
      badge={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <span className="size-1.5 rounded-full bg-primary" />4 Active Crews
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ label, value, unit, note, icon: Icon, tone, NoteIcon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className={`size-4 ${tone}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {value}
              {unit ? <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span> : null}
            </p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${tone}`}>
              {NoteIcon ? <NoteIcon className="size-3" /> : null}
              {note}
            </p>
          </div>
        ))}
      </div>
    </PanelShell>
  )
}

export function HotspotsVisual() {
  const hotspots = [
    { zone: 'Sector 4 Market', ward: 'Ward 4', count: 18, bar: 'bg-warning' },
    { zone: 'Station Road', ward: 'Ward 7', count: 14, bar: 'bg-primary' },
    { zone: 'Industrial Area Ph. 2', ward: 'Ward 12', count: 11, bar: 'bg-primary' },
    { zone: 'Riverside Walk', ward: 'Ward 9', count: 8, bar: 'bg-primary' },
  ]
  return (
    <PanelShell
      title="Identified Waste Hotspots"
      subtitle="Complaint density · last 7 days"
      badge={<Flame className="size-5 text-warning" />}
    >
      <ol className="flex flex-col gap-4">
        {hotspots.map((h, i) => (
          <li key={h.zone}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded border border-border text-[10px] text-muted-foreground">
                  {i + 1}
                </span>
                <span className="truncate font-medium text-foreground">{h.zone}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{h.ward}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{h.count}</span> complaints
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className={`h-full rounded-full ${h.bar}`} style={{ width: `${(h.count / 20) * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </PanelShell>
  )
}

export function DispatchVisual() {
  return (
    <PanelShell title="Quick Dispatch" subtitle="Assign an active crew to a high-density zone">
      <div className="flex flex-col gap-4">
        {[
          { label: 'Sanitation crew', value: 'Crew Alpha · Truck 07' },
          { label: 'Target zone', value: 'Sector 4 Market · Ward 4' },
        ].map((field) => (
          <div key={field.label}>
            <p className="text-xs font-medium text-muted-foreground">{field.label}</p>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground">
              {field.value}
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </div>
        ))}
        <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground">
          <Send className="size-4" />
          Dispatch Crew
        </span>
        <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-xs">
          <span className="font-mono text-foreground">ISS-1284</span>
          <span className="rounded-full border border-primary/30 bg-card px-2 py-0.5 font-medium text-primary">
            Dispatched · Crew Alpha
          </span>
        </div>
      </div>
    </PanelShell>
  )
}
