'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, MapPin, Recycle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function TopBar() {
  const router = useRouter()
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [initials, setInitials] = useState('AR')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user
      if (user) {
        setSessionUser(user)
        const name = user.user_metadata?.full_name || user.email || ''
        if (name) {
          const parts = name.trim().split(/\s+/)
          if (parts.length >= 2) {
            setInitials((parts[0][0] + parts[1][0]).toUpperCase())
          } else if (parts[0]?.length) {
            setInitials(parts[0].substring(0, 2).toUpperCase())
          }
        }
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSessionUser(null)
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur supports-backdrop-filter:bg-card/75">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Recycle className="size-5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold sm:text-base">
              CleanSync <span className="hidden font-normal text-muted-foreground sm:inline">Citizen Portal</span>
            </span>
            <span className="text-xs text-muted-foreground sm:hidden">Citizen Portal</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login?role=admin"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            Admin
          </Link>
          <Badge
            variant="outline"
            className="gap-1 border-primary/30 bg-accent px-2.5 py-1 text-accent-foreground"
          >
            <MapPin className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Active city: </span>
            Downtown Sector
          </Badge>
          {sessionUser ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer"
                title="Sign out of CleanSync"
              >
                <LogOut className="size-3.5 text-slate-500" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
