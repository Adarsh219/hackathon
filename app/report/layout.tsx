import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CleanSync Citizen Portal - Report Issue',
  description: 'Report issues, follow up on complaints, and book pickups — all in one place.',
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
