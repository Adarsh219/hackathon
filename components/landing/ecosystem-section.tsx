import Link from 'next/link'
import { ArrowRight, Building2, Check, Users } from 'lucide-react'
import { ButtonLink, SectionHeading } from './shared'

export function EcosystemSection() {
  return (
    <section id="ecosystem" aria-labelledby="ecosystem-title" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <SectionHeading
        id="ecosystem-title"
        eyebrow="Get Started"
        title="Built for both sides of the city"
        description="Whether you report the problem or dispatch the fix, CleanSync keeps everyone on the same ticket."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="glass-card flex flex-col p-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-medium text-primary">For Citizens</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Citizen Portal</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A frictionless, zero-learning-curve portal to snap a photo and report issues in seconds.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm text-foreground">
            {['GPS-verified photo reports', 'Track complaint status live', 'Schedule bulk waste pickups'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/login?role=citizen" variant="outline">
              Open Citizen Portal
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <Link
              href="/login?role=citizen"
              className="text-sm font-medium text-primary hover:underline"
            >
              Sign in →
            </Link>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-primary p-8 text-primary-foreground">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-medium text-primary-foreground/80">For Authorities</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Admin Command Center</h3>
          <p className="mt-3 leading-relaxed text-primary-foreground/85">
            The operational hub for sanitation supervisors: live metrics, ward-level hotspots, and instant crew
            dispatch.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {['Live grievance queue with ward filters', 'Automated 7-day hotspot ranking', 'Quick Dispatch to active crews'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="size-4" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login?role=admin"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary-foreground px-4 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Admin Sign In
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login?role=admin"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:underline"
            >
              Command Center →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
