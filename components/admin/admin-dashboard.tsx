'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { INITIAL_TICKETS, type AdminStatus, type AdminTicket } from '@/lib/admin-data'
import { AdminHeader } from './admin-header'
import { StatCards } from './stat-cards'
import { GrievanceTable } from './grievance-table'
import { HotspotsCard } from './hotspots-card'
import { QuickDispatchCard } from './quick-dispatch-card'

export function AdminDashboard() {
  const [tickets, setTickets] = useState<AdminTicket[]>(INITIAL_TICKETS)
  const [query, setQuery] = useState('')
  const [ward, setWard] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter((t) => {
      if (ward !== 'all' && t.ward !== ward) return false
      if (!q) return true
      return [t.id, t.category, t.location, t.ward].some((v) => v.toLowerCase().includes(q))
    })
  }, [tickets, query, ward])

  function updateStatus(id: string, status: AdminStatus, crew?: string) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, crew: crew ?? t.crew } : t)))
    toast.success(`${id} updated`, { description: crew ? `${status} · ${crew}` : `Status set to ${status}` })
  }

  return (
    <>
      <AdminHeader query={query} onQueryChange={setQuery} ward={ward} onWardChange={setWard} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-6">
        <StatCards />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          <GrievanceTable tickets={filtered} total={tickets.length} onUpdate={updateStatus} />
          <div className="flex flex-col gap-4">
            <HotspotsCard />
            <QuickDispatchCard />
          </div>
        </div>
      </main>
    </>
  )
}
