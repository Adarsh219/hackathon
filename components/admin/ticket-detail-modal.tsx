'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  ImageIcon,
  Loader,
  MapPin,
  Send,
  Truck,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CREWS, formatReported, type AdminStatus } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

export function getPriorityBadge(priority?: string) {
  const p = (priority || 'Low').trim().toLowerCase()
  if (p === 'urgent') {
    return {
      label: 'Urgent',
      className: 'border-red-200 bg-red-50 text-red-700',
      dot: 'bg-red-500',
    }
  }
  if (p === 'high') {
    return {
      label: 'High',
      className: 'border-orange-200 bg-orange-50 text-orange-700',
      dot: 'bg-orange-500',
    }
  }
  if (p === 'medium') {
    return {
      label: 'Medium',
      className: 'border-amber-200 bg-amber-50 text-amber-700',
      dot: 'bg-amber-500',
    }
  }
  return {
    label: 'Low',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  }
}

export const STATUS_STYLE: Record<string, string> = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-800',
  'In Progress': 'border-blue-200 bg-blue-50 text-blue-700',
  Dispatched: 'border-purple-200 bg-purple-50 text-purple-700',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rejected: 'border-rose-200 bg-rose-50 text-rose-700',
}

export type TicketDetailModalProps = {
  ticket: any | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: AdminStatus, crew?: string) => void | Promise<void>
}

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
}: TicketDetailModalProps) {
  const [localTicket, setLocalTicket] = useState<any>(ticket)

  // Sync localTicket when incoming ticket changes
  useEffect(() => {
    setLocalTicket(ticket)
  }, [ticket])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !localTicket) return null

  const ticketId = localTicket.ticket_id || localTicket.id || 'N/A'
  const category = localTicket.category || localTicket.title || 'Civic Issue'
  const ward = localTicket.ward || 'Ward 4'
  const status = localTicket.status || 'Pending'
  const priority = localTicket.priority || 'Medium'
  const priorityBadge = getPriorityBadge(priority)
  const description = localTicket.description || localTicket.location || 'No description provided.'
  const latitude = localTicket.latitude ?? 26.8467
  const longitude = localTicket.longitude ?? 80.9462
  const reportedRaw = localTicket.created_at || localTicket.reportedAt || new Date().toISOString()
  const { date, time } = formatReported(reportedRaw)

  const handleStatusChange = async (newStatus: AdminStatus, crew?: string) => {
    await onUpdateStatus(localTicket.id || localTicket.ticket_id, newStatus, crew)
    setLocalTicket((prev: any) => ({
      ...prev,
      status: newStatus,
      ...(crew ? { crew } : {}),
    }))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-500">
                #{ticketId}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] font-semibold shadow-2xs',
                  priorityBadge.className
                )}
              >
                <span className={cn('size-1.5 rounded-full mr-1.5', priorityBadge.dot)} aria-hidden="true" />
                {priorityBadge.label} Priority
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-2xs',
                  STATUS_STYLE[status] || 'border-slate-200 bg-slate-50 text-slate-700'
                )}
              >
                {status}
              </Badge>
            </div>
            <h3 id="ticket-detail-title" className="text-xl font-bold tracking-tight text-slate-900">
              {category}
            </h3>
            <span className="text-xs text-slate-400">
              Reported on {date} at {time}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close ticket details"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Incident Photo */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Incident Photo
          </span>
          {localTicket.image_url ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
              <img
                src={localTicket.image_url}
                alt={category}
                className="w-full max-h-72 object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <ImageIcon className="size-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-slate-600">No image attached</span>
              <span className="text-xs text-slate-400">The citizen did not upload photo evidence with this complaint.</span>
            </div>
          )}
        </div>

        {/* Incident Description */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Incident Description
          </span>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>

        {/* Geolocation & Ward */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Geolocation & Ward
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="size-4.5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">{ward}</span>
                <span className="text-xs font-mono text-slate-500 mt-0.5">
                  Lat: {latitude}, Long: {longitude}
                </span>
                {localTicket.location && (
                  <span className="text-xs text-slate-600 mt-0.5">{localTicket.location}</span>
                )}
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs w-fit"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="size-3.5 text-slate-400" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={status === 'In Progress'}
              onClick={() => handleStatusChange('In Progress')}
              className="h-8 gap-1.5 text-xs font-medium text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 cursor-pointer"
            >
              <Loader className="size-3.5 text-blue-600" aria-hidden="true" />
              Mark In Progress
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={status === 'Resolved'}
              onClick={() => handleStatusChange('Resolved')}
              className="h-8 gap-1.5 text-xs font-medium text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden="true" />
              Mark Resolved
            </Button>

            {localTicket.crew && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                <Truck className="size-3.5 text-slate-400" />
                {localTicket.crew}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700 shadow-2xs cursor-pointer"
                >
                  <Send className="size-3.5" aria-hidden="true" />
                  Dispatch Crew
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg"
            >
              <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                Assign Active Crew
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              {CREWS.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => handleStatusChange('Dispatched', c.name)}
                  className="text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <Truck className="size-3.5 text-slate-400 mr-1.5" />
                  <span>{c.name}</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-mono">
                    {c.members} crew
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
