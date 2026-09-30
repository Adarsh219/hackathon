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
      let hasAdminAccess = false

      // 1. First inspect supabase.auth.getSession()
      try {
        const { data } = await supabase.auth.getSession()
        const session = data?.session
        const user = session?.user

        if (session && user) {
          const userEmail = (user.email || '').toLowerCase()
          const isGovEmail =
            userEmail.endsWith('@gov.in') || userEmail.endsWith('@cleansync.gov')
          const isAdminRole =
            user.role === 'admin' ||
            (user.user_metadata as any)?.role === 'admin' ||
            (typeof window !== 'undefined' && localStorage.getItem('cleansync_user_role') === 'admin')

          if (isGovEmail || isAdminRole) {
            hasAdminAccess = true
          }
        }
      } catch {}

      // 2. If empty or unverified in Supabase, check localStorage.getItem('cleansync_user')
      if (!hasAdminAccess && typeof window !== 'undefined') {
        try {
          const storedUserRaw = localStorage.getItem('cleansync_user')
          if (storedUserRaw) {
            const storedUser = JSON.parse(storedUserRaw)
            if (
              storedUser?.role === 'admin' ||
              storedUser?.email === 'admin@cleansync.gov' ||
              storedUser?.email?.endsWith('@gov.in') ||
              storedUser?.email?.endsWith('@cleansync.gov')
            ) {
              hasAdminAccess = true
            }
          }
        } catch {}

        // Fallback for demo admin flags
        if (!hasAdminAccess && localStorage.getItem('cleansync_admin_auth') === 'true') {
          hasAdminAccess = true
        }
      }

      // 3. Only redirect to /login?role=admin if both Supabase session and localStorage demo session are absent
      if (!hasAdminAccess) {
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

  // Prevent flash of unauthorized/login content while storage check resolves
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
