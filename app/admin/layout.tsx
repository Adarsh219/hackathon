import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CleanSync Admin Operations',
  description: 'Operations dashboard for municipal waste grievances, hotspots, and crew dispatch.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
