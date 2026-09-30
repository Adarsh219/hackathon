import { Activity, Building2, Check, Flame, LocateFixed, MousePointerClick, Truck, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeading } from './shared'
import { DispatchVisual, GeoReportVisual, HotspotsVisual, MetricsVisual, QuickLogVisual } from './feature-visuals'

type Feature = {
  icon: typeof Activity
  title: string
  body: string
  points: string[]
  Visual: () => React.ReactNode
}

const citizenFeatures: Feature[] = [
  {
    icon: LocateFixed,
    title: 'Geolocation-Verified Reporting',
    body: 'Every report arrives with precise GPS coordinates attached automatically. No typing addresses and no vague landmarks, so crews find the exact spot on the first trip.',
    points: ['GPS coordinates auto-attached to each ticket', 'Photo evidence stamped with location', 'Ward resolved automatically from position'],
    Visual: GeoReportVisual,
  },
  {
    icon: MousePointerClick,
    title: 'Zero-Learning-Curve Issue Logging',
    body: 'Pick a category, snap a photo, set priority, submit. Anyone can log illegal dumping, overflowing bins or e-waste in under a minute, then track the ticket until it is resolved.',
    points: ['Clear categories like Dead Animal and E-Waste', 'Low, Medium and Urgent priority levels', 'Live status tracking for every complaint'],
    Visual: QuickLogVisual,
  },
]

const authorityFeatures: Feature[] = [
  {
    icon: Activity,
    title: 'Live Operational Metrics',
    body: 'Monitor city-wide sanitation health in real-time. Track total grievances, active crews, and average resolution times to ensure SLA compliance.',
    points: ['Total, pending and in-progress counts', 'Average resolution time trends', 'Live crew availability status'],
    Visual: MetricsVisual,
  },
  {
    icon: Flame,
    title: 'Automated Hotspot Mapping',
    body: 'Stop guessing where the problems are. CleanSync aggregates complaint density over a 7-day rolling window to instantly map high-priority target zones and wards.',
    points: ['7-day rolling complaint density', 'Ranked target zones by ward', 'Updates as new tickets land'],
    Visual: HotspotsVisual,
  },
  {
    icon: Truck,
    title: 'Quick Crew Dispatch',
    body: 'Go from pending ticket to dispatched truck in seconds. Assign active sanitation units (like Crew Alpha) directly to identified hotspots right from the dashboard.',
    points: ['Pick crew and target zone in two clicks', 'Ticket status updates instantly', 'Citizens see the dispatch on their ticket'],
    Visual: DispatchVisual,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <SectionHeading
        id="features-title"
        eyebrow="The CleanSync Platform"
        title="Two experiences, one shared source of truth"
        description="A citizen portal simple enough for anyone, connected to a command center built for municipal operations. Every report on one side becomes actionable data on the other."
      />

      <FeatureHalf
        id="for-citizens"
        icon={Users}
        label="For Citizens"
        title="Report in seconds, with proof of place"
        features={citizenFeatures}
        startIndex={0}
      />
      <FeatureHalf
        id="for-authorities"
        icon={Building2}
        label="For Authorities"
        title="Turn every report into a dispatch decision"
        features={authorityFeatures}
        startIndex={citizenFeatures.length}
      />
    </section>
  )
}

function FeatureHalf({
  id,
  icon: Icon,
  label,
  title,
  features,
  startIndex,
}: {
  id: string
  icon: typeof Users
  label: string
  title: string
  features: Feature[]
  startIndex: number
}) {
  return (
    <div id={id} className="mt-20 scroll-mt-24 md:mt-28">
      <div className="glass-card flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </p>
        <h3 className="text-balance text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-14 flex flex-col gap-20 md:gap-24">
        {features.map((feature, i) => {
          const { icon: FeatureIcon, Visual } = feature
          const flipped = (startIndex + i) % 2 === 1
          return (
            <article key={feature.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn(flipped && 'lg:order-2')}>
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <FeatureIcon className="size-5" aria-hidden="true" />
                </span>
                <h4 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {feature.title}
                </h4>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{feature.body}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cn('glass-card overflow-hidden p-2 shadow-xl shadow-foreground/5', flipped && 'lg:order-1')}>
                <Visual />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
