'use client'

import { CheckCircle2, Loader, MoreHorizontal, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CREWS, formatReported, type AdminStatus, type AdminTicket } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<AdminStatus, string> = {
  Pending: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  'In Progress': 'border-sky-400/30 bg-sky-400/10 text-sky-400',
  Dispatched: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  Resolved: 'border-primary/30 bg-primary/10 text-primary',
}

type Props = {
  tickets: AdminTicket[]
  total: number
  onUpdate: (id: string, status: AdminStatus, crew?: string) => void
}

export function GrievanceTable({ tickets, total, onUpdate }: Props) {
  return (
    <Card className="min-w-0 gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b px-4 py-3 [.border-b]:pb-3">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-sm font-semibold">Incoming Waste Issues</CardTitle>
          <CardDescription className="text-xs">
            Showing {tickets.length} of {total} tickets
          </CardDescription>
        </div>
        <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
          Live queue
        </Badge>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 text-xs">Ticket ID</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Location / Ward</TableHead>
              <TableHead className="text-xs">Date Reported</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="pr-4 text-right text-xs">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No tickets match your filters.
                </TableCell>
              </TableRow>
            )}
            {tickets.map((t) => {
              const { date, time } = formatReported(t.reportedAt)
              return (
                <TableRow key={t.id}>
                  <TableCell className="pl-4 font-mono text-xs font-medium">{t.id}</TableCell>
                  <TableCell className="text-sm">{t.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="max-w-56 truncate text-sm">{t.location}</span>
                      <span className="text-xs text-muted-foreground">{t.ward}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm tabular-nums">{date}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-0.5">
                      <Badge variant="outline" className={cn('text-[11px]', STATUS_STYLE[t.status])}>
                        {t.status}
                      </Badge>
                      {t.crew && t.status !== 'Resolved' && (
                        <span className="text-[11px] text-muted-foreground">{t.crew}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${t.id}`}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="font-mono text-xs">{t.id}</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={t.status === 'In Progress'}
                          onClick={() => onUpdate(t.id, 'In Progress')}
                        >
                          <Loader className="size-4" aria-hidden="true" />
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={t.status === 'Resolved'}
                          onClick={() => onUpdate(t.id, 'Resolved')}
                        >
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Send className="size-4" aria-hidden="true" />
                            Dispatch Team
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {CREWS.map((c) => (
                              <DropdownMenuItem key={c.id} onClick={() => onUpdate(t.id, 'Dispatched', c.name)}>
                                {c.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
