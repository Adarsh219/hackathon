export const ISSUE_CATEGORIES = [
  { value: 'overflowing-bin', label: 'Overflowing Bin' },
  { value: 'garbage-on-road', label: 'Garbage on Road' },
  { value: 'missed-collection', label: 'Missed Collection' },
  { value: 'illegal-dumping', label: 'Illegal Dumping' },
] as const

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]['value'] | 'Pickup Request' | string

export const PRIORITIES = ['low', 'medium', 'urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export const TIMELINE_STEPS = [
  { key: 'reported', label: 'Reported' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'cleaning', label: 'Cleaning in Progress' },
  { key: 'resolved', label: 'Resolved' },
] as const

export type TicketStatus = 'pending' | 'in-progress' | 'resolved'

export type TimelineEvent = {
  at: string
  note: string
}

export type Ticket = {
  id: string
  category: IssueCategory
  location: string
  description: string
  priority: Priority
  createdAt: string
  stepIndex: number
  events: (TimelineEvent | null)[]
}

export function statusFromStep(stepIndex: number): TicketStatus {
  if (stepIndex >= 3) return 'resolved'
  if (stepIndex >= 1) return 'in-progress'
  return 'pending'
}

export function categoryLabel(value: IssueCategory | string) {
  if (value === 'Pickup Request' || value?.toLowerCase() === 'pickup request') return 'Scheduled Pickup'
  return ISSUE_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ISS-104',
    category: 'overflowing-bin',
    location: '14 Market Street, near Central Bus Stop',
    description: 'Community bin overflowing for two days, attracting stray animals.',
    priority: 'urgent',
    createdAt: '2026-09-28T08:15:00',
    stepIndex: 2,
    events: [
      { at: '2026-09-28T08:15:00', note: 'Complaint submitted via Citizen Portal.' },
      { at: '2026-09-28T10:40:00', note: 'Assigned to Sanitation Crew D-07.' },
      { at: '2026-09-29T07:05:00', note: 'Crew on-site, clearing and sanitizing the area.' },
      null,
    ],
  },
  {
    id: 'ISS-098',
    category: 'illegal-dumping',
    location: 'Vacant lot behind Riverside Mall',
    description: 'Construction debris dumped overnight, blocking the footpath.',
    priority: 'medium',
    createdAt: '2026-09-25T17:30:00',
    stepIndex: 0,
    events: [
      { at: '2026-09-25T17:30:00', note: 'Complaint submitted with 2 photos.' },
      null,
      null,
      null,
    ],
  },
  {
    id: 'ISS-087',
    category: 'missed-collection',
    location: 'Block C, Greenview Apartments',
    description: 'Door-to-door collection skipped on Monday.',
    priority: 'low',
    createdAt: '2026-09-18T09:00:00',
    stepIndex: 3,
    events: [
      { at: '2026-09-18T09:00:00', note: 'Complaint submitted via Citizen Portal.' },
      { at: '2026-09-18T11:20:00', note: 'Assigned to Collection Route R-12.' },
      { at: '2026-09-19T06:45:00', note: 'Collection vehicle dispatched.' },
      { at: '2026-09-19T08:10:00', note: 'Waste collected. Ticket closed.' },
    ],
  },
]

export const PICKUP_WASTE_TYPES = [
  { value: 'e-waste', label: 'E-Waste (electronics, appliances)' },
  { value: 'garden', label: 'Garden Waste (branches, leaves)' },
  { value: 'furniture', label: 'Bulky Furniture' },
  { value: 'construction', label: 'Construction Debris (small)' },
] as const
