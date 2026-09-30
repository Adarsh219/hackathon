'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CitizenView } from '@/components/cleansync/citizen-view'

export default function ReportPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkCitizenSession = async () => {
      const { data } = await supabase.auth.getSession()
      const storedSession =
        typeof window !== 'undefined' ? localStorage.getItem('cleansync_session') : null
      const userRole =
        typeof window !== 'undefined' ? localStorage.getItem('cleansync_user_role') : null

      const hasActiveSession = !!data?.session || !!storedSession || !!userRole

      if (!hasActiveSession) {
        if (isMounted) setIsAuthenticated(false)
        router.replace('/login?role=citizen')
      } else {
        if (isMounted) setIsAuthenticated(true)
      }
    }

    checkCitizenSession()

    return () => {
      isMounted = false
    }
  }, [router])

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-3">
        <Loader2 className="size-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Checking citizen authentication…</p>
      </div>
    )
  }

  return <CitizenView />
}
