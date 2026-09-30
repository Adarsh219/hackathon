import Link from 'next/link'
import { ArrowRight, Building2, Camera, Flame, LocateFixed, Radio, Users } from 'lucide-react'
import { ButtonLink } from './shared'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <h1
            id="hero-title"
            className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Frictionless citizen reporting. <span className="text-primary">Enterprise municipal dispatch.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            CleanSync closes the loop between the people who spot waste and the authorities who clear it. Citizens
            report in seconds with GPS-verified photos. Every report feeds a live command center that maps hotspots and
            dispatches the right crew.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/report" size="lg">
              Report an Issue
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/login?role=admin" size="lg" variant="outline">
              Command Center
            </ButtonLink>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { value: '<60s', label: 'To file a report' },
              { value: '4.2h', label: 'Avg. resolution' },
              { value: '7-day', label: 'Hotspot window' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <PlatformPreview />
      </div>
    </section>
  )
}

const queue = [
  { id: 'ISS-1285', category: 'Illegal Dumping', location: 'Sector 4 Market', ward: 'Ward 4', status: 'New' },
  { id: 'ISS-1283', category: 'Overflowing Bin', location: 'Station Road', ward: 'Ward 7', status: 'In Progress' },
  { id: 'ISS-1281', category: 'Dead Animal', location: 'NH-48 Service Lane', ward: 'Ward 12', status: 'Dispatched' },
]

const statusStyles: Record<string, string> = {
  New: 'border-amber-200 bg-amber-50 text-amber-700',
  'In Progress': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Dispatched: 'border-slate-200 bg-slate-100 text-slate-700',
}

function PlatformPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto items-stretch" aria-hidden="true">
      {/* Citizen Portal Preview Card */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <Users className="size-3.5" />
            Citizen Portal
          </p>
          <span className="text-[11px] font-medium text-slate-400">Just now</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Camera className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Illegal Dumping · Medium priority</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
              <LocateFixed className="size-3 text-emerald-600" />
              28.6139° N, 77.2090° E · ±4 m
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs">
            Submitted
          </span>
        </div>
      </div>

      {/* Admin Operations Card */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Building2 className="size-3.5" />
              Admin Operations
            </p>
            <p className="mt-1 font-bold text-slate-900">Incoming Waste Issues</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <Radio className="size-3 text-emerald-600 animate-pulse" />
            Live queue
          </span>
        </div>

        <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          {queue.map((t) => (
            <li
              key={t.id}
              className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                t.status === 'New' ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
              }`}
            >
              <span className="w-16 shrink-0 font-mono text-xs font-semibold text-slate-500">{t.id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-900">{t.category}</span>
                <span className="block truncate text-xs text-slate-500">
                  {t.location} · {t.ward}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[t.status]}`}
              >
                {t.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Flame className="size-4" />
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-slate-900">
            <span className="font-semibold">Hotspot: Sector 4 Market</span>
            <span className="text-slate-500"> · 19 complaints · 7 days</span>
          </p>
          <span className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-xs">
            Dispatch Crew Alpha
          </span>
        </div>
      </div>
    </div>
  )
}
