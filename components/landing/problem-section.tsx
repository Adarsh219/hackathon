import { Building2, EyeOff, MapPinOff, MessageSquareOff, PhoneOff, Users } from 'lucide-react'
import { SectionHeading } from './shared'

const sides = [
  {
    label: 'For Citizens',
    icon: Users,
    problems: [
      {
        icon: PhoneOff,
        title: 'Reporting feels like a chore',
        body: 'Helplines, long forms and vague addresses mean most people who spot illegal dumping simply walk past it.',
      },
      {
        icon: MessageSquareOff,
        title: 'Reports disappear',
        body: 'With no ticket or status updates, citizens never learn if anyone acted, and they stop reporting at all.',
      },
    ],
  },
  {
    label: 'For Authorities',
    icon: Building2,
    problems: [
      {
        icon: EyeOff,
        title: 'No operational visibility',
        body: 'Grievances sit in inboxes and spreadsheets. Supervisors cannot see pending volume or resolution times until SLAs are breached.',
      },
      {
        icon: MapPinOff,
        title: 'Guesswork deployment',
        body: 'Without location-accurate data, trucks follow fixed routes while the same markets and wards overflow week after week.',
      },
    ],
  },
]

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <SectionHeading
        id="problem-title"
        eyebrow="The Problem"
        title="The loop is broken on both sides"
        description="Citizens have no easy way to report waste, and authorities have no reliable data to act on. Each side's gap makes the other's worse."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {sides.map(({ label, icon: SideIcon, problems }) => (
          <div key={label}>
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <SideIcon className="size-4 text-primary" aria-hidden="true" />
              {label}
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {problems.map(({ icon: Icon, title, body }) => (
                <li key={title} className="glass-card flex gap-4 border-l-4 border-l-destructive/70 p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
