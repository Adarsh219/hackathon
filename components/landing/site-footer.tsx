import { Trophy } from 'lucide-react'
import { Logo } from './shared'

export function SiteFooter() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-slate-200/80 mt-12 gap-4 text-xs text-slate-500 max-w-6xl mx-auto px-4 md:px-6 w-full">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-center sm:text-left">
        <Logo />
        <span className="hidden sm:inline text-slate-300" aria-hidden="true">
          ·
        </span>
        <span>© 2026 CleanSync. Dispatch and operations for municipal sanitation.</span>
      </div>
      <span
        aria-label="🏆 Built for SPECTRUM-2026 Innovation Hackathon"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 shadow-xs"
      >
        <Trophy className="size-3.5 text-amber-500" aria-hidden="true" />
        Built for SPECTRUM-2026 Innovation Hackathon
      </span>
    </footer>
  )
}
