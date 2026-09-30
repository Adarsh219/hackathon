import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { Logo } from './shared'

const footerLinks = [
  { href: '/login', label: 'Sign In' },
  { href: '/report', label: 'Citizen Portal' },
  { href: '/login?role=admin', label: 'Admin Portal' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' },
  { href: 'mailto:hello@cleansync.city', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/60 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            {'© 2026 CleanSync. Dispatch and operations for municipal sanitation.'}
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="Footer">
            <ul className="flex gap-6">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground md:self-end">
            <Trophy className="size-3.5" aria-hidden="true" />
            Built for SPECTRUM-2026 Innovation Hackathon
          </span>
        </div>
      </div>
    </footer>
  )
}
