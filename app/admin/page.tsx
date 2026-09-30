'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkAdminAccess = async () => {
      // 1. Check Supabase session
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      const user = session?.user

      // 2. Check localStorage demoAdmin / role flags
      const demoAdminFlag =
        typeof window !== 'undefined'
          ? localStorage.getItem('cleansync_admin_auth') === 'true'
          : false
      const userRole =
        typeof window !== 'undefined'
          ? localStorage.getItem('cleansync_user_role')
          : null

      const userEmail = (user?.email || '').toLowerCase()
      const isGovEmail =
        userEmail.endsWith('@gov.in') || userEmail.endsWith('@cleansync.gov')
      const isAdminRole =
        user?.role === 'admin' ||
        (user?.user_metadata as any)?.role === 'admin' ||
        userRole === 'admin'

      const hasActiveAdminSession =
        (!!session && (isGovEmail || isAdminRole)) || demoAdminFlag

      if (!hasActiveAdminSession) {
        if (isMounted) setIsAuthorized(false)
        router.replace('/login?role=admin')
      } else {
        if (isMounted) setIsAuthorized(true)
      }
    }

    checkAdminAccess()

    return () => {
      isMounted = false
    }
  }, [router])

  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-3">
        <Loader2 className="size-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Verifying officer authorization…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
      <AdminDashboard />
    </div>
  )
}
