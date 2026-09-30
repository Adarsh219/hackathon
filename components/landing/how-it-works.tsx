import Link from 'next/link'
import { Building2, Camera, Flame, LocateFixed, Truck, Users } from 'lucide-react'
import { SectionHeading } from './shared'

const steps = [
  {
    icon: Camera,
    actor: 'Citizen',
    title: 'Citizen Snaps Photo',
    body: 'A resident spots illegal dumping, a dead animal or e-waste and logs it on the portal with a photo.',
  },
  {
    icon: LocateFixed,
    actor: 'Citizen Portal',
    title: 'GPS Auto-Locates',
    body: 'Precise coordinates and the ward are attached automatically, and the ticket lands in the live queue.',
  },
  {
    icon: Flame,
    actor: 'Admin Dashboard',
    title: 'Dashboard Maps the Hotspot',
    body: "Complaint density updates 'Identified Waste Hotspots' in real-time across a 7-day window.",
  },
  {
    icon: Truck,
    actor: 'Field Crew',
    title: 'Sanitation Crew Dispatched',
    body: 'An admin assigns an active truck to the target zone, and the citizen sees the status change on their ticket.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <SectionHeading
        id="how-title"
        eyebrow="How it Works"
        title="From a citizen's photo to a crew on the ground"
        description="One continuous lifecycle that connects the public portal to the operations command center, with no calls, paperwork or re-typed addresses in between."
      />

      <div className="mt-14 hidden grid-cols-2 gap-6 md:grid">
        <Link
          href="/report"
          className="flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-secondary py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <Users className="size-3.5" />
          Citizen Portal
        </Link>
        <Link
          href="/login?role=admin"
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2 text-xs font-medium text-foreground transition-colors hover:bg-card/80"
        >
          <Building2 className="size-3.5" />
          Admin Operations
        </Link>
      </div>

      <div className="relative mt-10">
        <div
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 md:block"
        />
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map(({ icon: Icon, actor, title, body }, index) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              <span className="relative flex size-14 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-sm backdrop-blur-md">
                <Icon className="size-6" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </span>
              <p className="mt-5 text-xs font-medium text-primary">{actor}</p>
              <h3 className="mt-1 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 max-w-56 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
