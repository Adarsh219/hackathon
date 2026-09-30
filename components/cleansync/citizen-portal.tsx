'use client'

import { useState } from 'react'
import { BookOpen, ClipboardList, Megaphone, Truck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INITIAL_TICKETS, type Ticket } from '@/lib/cleansync-data'
import { ReportIssueForm } from './report-issue-form'
import { TrackComplaints } from './track-complaints'
import { SchedulePickup } from './schedule-pickup'
import { AwarenessHub } from './awareness-hub'

const TABS = [
  { value: 'report', label: 'Report an Issue', short: 'Report', icon: Megaphone },
  { value: 'track', label: 'Track My Complaints', short: 'Track', icon: ClipboardList },
  { value: 'pickup', label: 'Schedule Pickup', short: 'Pickup', icon: Truck },
  { value: 'awareness', label: 'Waste Awareness', short: 'Learn', icon: BookOpen },
] as const

type TabValue = (typeof TABS)[number]['value']

export function CitizenPortal() {
  const [tab, setTab] = useState<TabValue>('report')
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
  const [highlightId, setHighlightId] = useState<string | null>(null)

  function handleTicketCreated(ticket: Ticket) {
    setTickets((prev) => [ticket, ...prev])
    setHighlightId(ticket.id)
    setTab('track')
  }

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className="gap-6">
      <TabsList className="grid w-full grid-cols-4 group-data-horizontal/tabs:h-auto rounded-xl border bg-card p-1 shadow-xs">
        {TABS.map(({ value, label, short, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-full flex-col gap-1 rounded-lg py-2 text-xs data-active:bg-primary data-active:text-primary-foreground sm:flex-row sm:gap-2 sm:py-2.5 sm:text-sm"
          >
            <Icon aria-hidden="true" />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="report">
        <ReportIssueForm onCreated={handleTicketCreated} nextNumber={105 + tickets.length - INITIAL_TICKETS.length} />
      </TabsContent>
      <TabsContent value="track">
        <TrackComplaints tickets={tickets} highlightId={highlightId} />
      </TabsContent>
      <TabsContent value="pickup">
        <SchedulePickup />
      </TabsContent>
      <TabsContent value="awareness">
        <AwarenessHub />
      </TabsContent>
    </Tabs>
  )
}
