'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
export { AdminDashboard } from '@/components/admin/admin-dashboard'
export { TicketDetailModal } from '@/components/admin/ticket-detail-modal'

// Admin issues data fetch query
export async function fetchAdminIssues() {
  return await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })
}

export { stripAuditTags } from '@/lib/cleansync-data'

// Status change and dispatch click handlers
export async function handleStatusUpdate(
  selectedIssue: { id: string },
  status: 'In Progress' | 'Resolved' | 'Rejected',
  setTickets?: React.Dispatch<React.SetStateAction<any[]>>
) {
  if (status === 'In Progress') {
    const res = await supabase.from('issues').update({ status: 'In Progress' }).eq('id', selectedIssue.id)
    if (setTickets) {
      setTickets((prev) => prev.map((t) => (t.id === selectedIssue.id ? { ...t, status: 'In Progress' } : t)))
    }
    return res
  }
  if (status === 'Resolved') {
    const res = await supabase.from('issues').update({ status: 'Resolved' }).eq('id', selectedIssue.id)
    if (setTickets) {
      setTickets((prev) => prev.map((t) => (t.id === selectedIssue.id ? { ...t, status: 'Resolved' } : t)))
    }
    return res
  }
  if (status === 'Rejected') {
    const res = await supabase.from('issues').update({ status: 'Rejected' }).eq('id', selectedIssue.id)
    if (setTickets) {
      setTickets((prev) => prev.map((t) => (t.id === selectedIssue.id ? { ...t, status: 'Rejected' } : t)))
    }
    return res
  }
}

// SLA Target label helper
export function getAdminSlaTarget(priority?: string) {
  const p = (priority || 'low').trim().toLowerCase()
  if (p === 'urgent') return 'Target SLA: 4 Hours (High Velocity Queue)'
  if (p === 'medium') return 'Target SLA: 12 Hours (Standard Operations)'
  return 'Target SLA: 24 Hours (Scheduled Route)'
}

// Verification tag component / markup
export function AdminVerificationTag({
  description,
  metadata,
}: {
  description?: string
  metadata?: any
} = {}) {
  const text = `${description || ''} ${typeof metadata === 'string' ? metadata : JSON.stringify(metadata || '')}`
  const isVerified = text.includes('[VERIFIED')

  if (isVerified) {
    return (
      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span>✓</span> Live Camera & Hardware Geotag Verified
      </div>
    )
  }

  return (
    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <span>⚠️</span> Warning: Missing Hardware EXIF (Potential Non-Live Upload)
    </div>
  )
}

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
