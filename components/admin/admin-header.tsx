'use client'

import { useState } from 'react'
import { Recycle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { WARDS } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

type Props = {
  query: string
  onQueryChange: (v: string) => void
  ward: string
  onWardChange: (v: string) => void
}

export function AdminHeader({ query, onQueryChange, ward, onWardChange }: Props) {
  const [live, setLive] = useState(true)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Recycle className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-semibold tracking-tight sm:text-base">CleanSync Admin Operations</h1>
            <span className="text-xs text-muted-foreground">Municipal Waste Management Authority</span>
          </div>
        </div>

        <div className="order-last flex w-full items-center gap-2 md:order-none md:ml-auto md:w-auto">
          <div className="relative flex-1 md:w-72 md:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="admin-search" className="sr-only">Search tickets</label>
            <Input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search ticket, category, location…"
              className="h-9 pl-8"
            />
          </div>
          <Select items={WARDS} value={ward} onValueChange={(v) => onWardChange((v as string) ?? 'all')}>
            <SelectTrigger aria-label="Filter by ward" className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => (
                <SelectItem key={w.value} value={w.value}>
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-2.5 rounded-md border bg-card px-3 py-1.5 md:ml-0">
          <span className="relative flex size-2" aria-hidden="true">
            {live && <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />}
            <span className={cn('relative inline-flex size-2 rounded-full', live ? 'bg-primary' : 'bg-muted-foreground')} />
          </span>
          <span className="text-xs whitespace-nowrap" aria-live="polite">
            <span className="text-muted-foreground">System Status: </span>
            <span className={cn('font-medium', live ? 'text-primary' : 'text-muted-foreground')}>
              {live ? 'Online (4 Active Crews)' : 'Paused'}
            </span>
          </span>
          <Switch checked={live} onCheckedChange={setLive} aria-label="Toggle live monitoring" />
        </div>
      </div>
    </header>
  )
}
