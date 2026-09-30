import Link from 'next/link'
import { MapPin, Recycle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur supports-backdrop-filter:bg-card/75">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Recycle className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold sm:text-base">
            CleanSync <span className="hidden font-normal text-muted-foreground sm:inline">Citizen Portal</span>
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">Citizen Portal</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            Admin
          </Link>
          <Badge
            variant="outline"
            className="gap-1 border-primary/30 bg-accent px-2.5 py-3 text-accent-foreground"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Active city: </span>
            Downtown Sector
          </Badge>
          <Avatar className="size-9">
            <AvatarFallback className="bg-secondary text-sm font-medium text-secondary-foreground">
              AR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
