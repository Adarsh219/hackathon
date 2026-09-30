import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'CleanSync Admin Operations',
  description: 'Operations dashboard for municipal waste grievances, hotspots, and crew dispatch.',
}

export default function AdminPage() {
  return (
    <div data-admin-theme className="dark min-h-dvh bg-background text-foreground">
      <AdminDashboard />
    </div>
  )
}
