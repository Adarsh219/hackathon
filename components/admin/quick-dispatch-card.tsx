'use client'

import { useState } from 'react'
import { Send, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CREWS, HOTSPOTS } from '@/lib/admin-data'

const CREW_ITEMS = CREWS.map((c) => ({ value: c.id, label: c.name }))
const ZONE_ITEMS = HOTSPOTS.map((h) => ({ value: h.name, label: `${h.name} (${h.complaints})` }))

type Assignment = { crew: string; zone: string }

export function QuickDispatchCard() {
  const [crewId, setCrewId] = useState<string | null>(null)
  const [zone, setZone] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const crew = CREWS.find((c) => c.id === crewId)

  function dispatch() {
    if (!crew || !zone) return
    setAssignments((prev) => [{ crew: crew.name, zone }, ...prev.filter((a) => a.crew !== crew.name)].slice(0, 3))
    toast.success(`${crew.name} dispatched`, { description: `En route to ${zone}` })
    setCrewId(null)
    setZone(null)
  }

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-4 py-3 [.border-b]:pb-3">
        <CardTitle className="text-sm font-semibold">Quick Dispatch</CardTitle>
        <CardDescription className="text-xs">Assign an active crew to a high-density zone</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispatch-crew" className="text-xs text-muted-foreground">Sanitation crew</Label>
          <Select items={CREW_ITEMS} value={crewId} onValueChange={(v) => setCrewId(v as string | null)}>
            <SelectTrigger id="dispatch-crew" className="h-9 w-full">
              <SelectValue placeholder="Select active crew" />
            </SelectTrigger>
            <SelectContent>
              {CREWS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {crew && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3" aria-hidden="true" />
              {crew.members} members · {crew.vehicle}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispatch-zone" className="text-xs text-muted-foreground">Target zone</Label>
          <Select items={ZONE_ITEMS} value={zone} onValueChange={(v) => setZone(v as string | null)}>
            <SelectTrigger id="dispatch-zone" className="h-9 w-full">
              <SelectValue placeholder="Select hotspot" />
            </SelectTrigger>
            <SelectContent>
              {ZONE_ITEMS.map((z) => (
                <SelectItem key={z.value} value={z.value}>
                  {z.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={dispatch} disabled={!crew || !zone} className="h-9 w-full">
          <Send className="size-4" aria-hidden="true" />
          Dispatch Crew
        </Button>

        {assignments.length > 0 && (
          <ul className="flex flex-col gap-1.5 border-t pt-3" aria-label="Recent dispatches">
            {assignments.map((a) => (
              <li key={a.crew} className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium">{a.crew}</span>
                <span className="truncate text-muted-foreground">{'→ '}{a.zone}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
