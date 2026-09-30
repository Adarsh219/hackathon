'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TopBar } from '@/components/cleansync/top-bar'
import { CitizenPortal } from '@/components/cleansync/citizen-portal'

export function CitizenView() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const storedSession = typeof window !== 'undefined' ? localStorage.getItem('cleansync_session') : null
      const userRole = typeof window !== 'undefined' ? localStorage.getItem('cleansync_user_role') : null

      const hasSession = !!data?.session || !!storedSession || !!userRole

      if (!hasSession) {
        if (isMounted) setIsAuthenticated(false)
        router.replace('/login?role=citizen')
      } else {
        if (isMounted) setIsAuthenticated(true)
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [router])

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-3">
        <Loader2 className="size-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Checking authentication…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Keep your neighbourhood clean
          </h1>
          <p className="text-sm text-muted-foreground text-pretty sm:text-base">
            Report issues, follow up on complaints, and book pickups — all in one place.
          </p>
        </div>
        <CitizenPortal />
      </main>
    </div>
  )
}
