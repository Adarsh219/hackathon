export type AdminStatus = 'Pending' | 'In Progress' | 'Dispatched' | 'Resolved' | 'Rejected'

export type AdminPriority = 'Urgent' | 'High' | 'Medium' | 'Low'

export type AdminTicket = {
  id: string
  ticket_id?: string
  title?: string
  category: string
  description?: string
  location?: string
  ward: string
  latitude?: number
  longitude?: number
  reportedAt: string
  created_at?: string
  status: AdminStatus
  priority?: AdminPriority | string
  image_url?: string | null
  crew?: string
}

export const WARDS = [
  { value: 'all', label: 'All Wards' },
  { value: 'Ward 3', label: 'Ward 3 · Old Town' },
  { value: 'Ward 4', label: 'Ward 4 · Market' },
  { value: 'Ward 7', label: 'Ward 7 · Station' },
  { value: 'Ward 9', label: 'Ward 9 · Riverside' },
  { value: 'Ward 12', label: 'Ward 12 · Industrial' },
]

export const INITIAL_TICKETS: AdminTicket[] = [
  {
    id: 'ISS-1284',
    ticket_id: 'ISS-1284',
    title: 'Illegal Dumping',
    category: 'Illegal Dumping',
    location: 'Sector 4 Market, Gate 2',
    ward: 'Ward 4',
    reportedAt: '2026-09-30T08:42:00',
    created_at: '2026-09-30T08:42:00',
    status: 'Pending',
    priority: 'Urgent',
    latitude: 26.8467,
    longitude: 80.9462,
    description: 'Commercial vegetable vendors and plastic wholesale stalls dumped massive heaps of wet waste and packaging bags on the pedestrian walkway near Gate 2. Stray animals gathering and foul odor spreading.',
    image_url: '/images/awareness/wet-waste.jpg',
  },
  {
    id: 'ISS-1283',
    ticket_id: 'ISS-1283',
    title: 'Overflowing Bin',
    category: 'Overflowing Bin',
    location: 'Station Road, Bus Stand',
    ward: 'Ward 7',
    reportedAt: '2026-09-30T08:15:00',
    created_at: '2026-09-30T08:15:00',
    status: 'In Progress',
    crew: 'Crew Alpha',
    priority: 'High',
    latitude: 26.8322,
    longitude: 80.9234,
    description: 'Large community dustbin completely overflowing. Garbage has spilled over onto the walkway near bus stand platform 4.',
    image_url: '/images/awareness/dry-waste.jpg',
  },
  {
    id: 'ISS-1282',
    ticket_id: 'ISS-1282',
    title: 'Garbage on Road',
    category: 'Garbage on Road',
    location: 'Riverside Walk, Pier 3',
    ward: 'Ward 9',
    reportedAt: '2026-09-30T07:58:00',
    created_at: '2026-09-30T07:58:00',
    status: 'Pending',
    priority: 'Medium',
    latitude: 26.8589,
    longitude: 80.9611,
    description: 'Broken glass bottles, beverage cans and plastic bags scattered along the waterfront promenade near Pier 3 after evening crowds.',
    image_url: null,
  },
  {
    id: 'ISS-1281',
    ticket_id: 'ISS-1281',
    title: 'Dead Animal',
    category: 'Dead Animal',
    location: 'NH-48 Service Lane',
    ward: 'Ward 12',
    reportedAt: '2026-09-30T07:31:00',
    created_at: '2026-09-30T07:31:00',
    status: 'Dispatched',
    crew: 'Crew Delta',
    priority: 'Urgent',
    latitude: 26.8211,
    longitude: 80.8992,
    description: 'Animal carcass lying on the shoulder of NH-48 service road. Poses hazard for traffic and requires urgent sanitary removal.',
    image_url: '/images/awareness/cleanup-drive.jpg',
  },
  {
    id: 'ISS-1280',
    ticket_id: 'ISS-1280',
    title: 'Missed Pickup',
    category: 'Missed Pickup',
    location: 'Old Town, Lane 14',
    ward: 'Ward 3',
    reportedAt: '2026-09-30T06:47:00',
    created_at: '2026-09-30T06:47:00',
    status: 'Resolved',
    priority: 'Low',
    latitude: 26.8415,
    longitude: 80.9388,
    description: 'Door-to-door municipal collection skipped for Lane 14 households on morning round.',
    image_url: null,
  },
  {
    id: 'ISS-1279',
    ticket_id: 'ISS-1279',
    title: 'Overflowing Bin',
    category: 'Overflowing Bin',
    location: 'Sector 4 Market, Fish Stall',
    ward: 'Ward 4',
    reportedAt: '2026-09-29T22:10:00',
    created_at: '2026-09-29T22:10:00',
    status: 'In Progress',
    crew: 'Crew Bravo',
    priority: 'High',
    latitude: 26.8471,
    longitude: 80.9458,
    description: 'Fish and poultry market organic refuse bin overflowing and leaking fluids onto the side street.',
    image_url: '/images/awareness/wet-waste.jpg',
  },
  {
    id: 'ISS-1278',
    ticket_id: 'ISS-1278',
    title: 'Construction Debris',
    category: 'Construction Debris',
    location: 'Industrial Area Phase 2',
    ward: 'Ward 12',
    reportedAt: '2026-09-29T19:26:00',
    created_at: '2026-09-29T19:26:00',
    status: 'Pending',
    priority: 'Medium',
    latitude: 26.8123,
    longitude: 80.9015,
    description: 'Piles of crushed brick, concrete rubble, and empty plaster sacks left unattended on road curb.',
    image_url: null,
  },
  {
    id: 'ISS-1277',
    ticket_id: 'ISS-1277',
    title: 'Illegal Dumping',
    category: 'Illegal Dumping',
    location: 'Station Road, Flyover',
    ward: 'Ward 7',
    reportedAt: '2026-09-29T17:02:00',
    created_at: '2026-09-29T17:02:00',
    status: 'Pending',
    priority: 'High',
    latitude: 26.8335,
    longitude: 80.9248,
    description: 'Old tires, discarded furniture and torn sacks dumped underneath the flyover pillars.',
    image_url: '/images/awareness/dry-waste.jpg',
  },
  {
    id: 'ISS-1276',
    ticket_id: 'ISS-1276',
    title: 'Drain Blockage',
    category: 'Drain Blockage',
    location: 'Riverside Colony, Block C',
    ward: 'Ward 9',
    reportedAt: '2026-09-29T15:40:00',
    created_at: '2026-09-29T15:40:00',
    status: 'Resolved',
    priority: 'Urgent',
    latitude: 26.8592,
    longitude: 80.9625,
    description: 'Main drainage outlet blocked with silt, plastic containers, and leaves causing wastewater backflow.',
    image_url: null,
  },
  {
    id: 'ISS-1275',
    ticket_id: 'ISS-1275',
    title: 'Garbage on Road',
    category: 'Garbage on Road',
    location: 'Clock Tower Circle',
    ward: 'Ward 3',
    reportedAt: '2026-09-29T13:18:00',
    created_at: '2026-09-29T13:18:00',
    status: 'In Progress',
    crew: 'Crew Charlie',
    priority: 'Medium',
    latitude: 26.8428,
    longitude: 80.9395,
    description: 'Litter accumulation along circle traffic island following weekly flea market.',
    image_url: '/images/awareness/wet-waste.jpg',
  },
  {
    id: 'ISS-1274',
    ticket_id: 'ISS-1274',
    title: 'E-waste Dumping',
    category: 'E-waste Dumping',
    location: 'Industrial Area Phase 1',
    ward: 'Ward 12',
    reportedAt: '2026-09-29T11:05:00',
    created_at: '2026-09-29T11:05:00',
    status: 'Dispatched',
    crew: 'Crew Alpha',
    priority: 'High',
    latitude: 26.8145,
    longitude: 80.9032,
    description: 'Burned circuit boards, monitor housings and batteries dumped near electrical substation fence.',
    image_url: '/images/awareness/e-waste.jpg',
  },
  {
    id: 'ISS-1273',
    ticket_id: 'ISS-1273',
    title: 'Missed Pickup',
    category: 'Missed Pickup',
    location: 'Sector 4, Housing Block B',
    ward: 'Ward 4',
    reportedAt: '2026-09-29T09:47:00',
    created_at: '2026-09-29T09:47:00',
    status: 'Resolved',
    priority: 'Low',
    latitude: 26.8488,
    longitude: 80.9442,
    description: 'Weekly dry recyclable collection skipped for Block B residents.',
    image_url: null,
  },
]

export type Hotspot = { name: string; ward: string; complaints: number }

export const HOTSPOTS: Hotspot[] = [
  { name: 'Sector 4 Market', ward: 'Ward 4', complaints: 18 },
  { name: 'Station Road', ward: 'Ward 7', complaints: 14 },
  { name: 'Industrial Area Ph. 2', ward: 'Ward 12', complaints: 11 },
  { name: 'Riverside Walk', ward: 'Ward 9', complaints: 8 },
]

export type Crew = { id: string; name: string; vehicle: string; members: number; available: boolean }

export const CREWS: Crew[] = [
  { id: 'alpha', name: 'Crew Alpha', vehicle: 'Compactor · MH-12 4471', members: 4, available: true },
  { id: 'bravo', name: 'Crew Bravo', vehicle: 'Tipper · MH-12 2290', members: 3, available: true },
  { id: 'charlie', name: 'Crew Charlie', vehicle: 'Mini Truck · MH-12 8812', members: 3, available: true },
  { id: 'delta', name: 'Crew Delta', vehicle: 'Compactor · MH-12 5530', members: 5, available: true },
]

export function formatReported(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}

export function isPickupRequest(category?: string, title?: string): boolean {
  const cat = (category || '').trim().toLowerCase()
  const tit = (title || '').trim().toLowerCase()
  return (
    cat === 'pickup request' ||
    cat === 'bulk waste pickup' ||
    cat.includes('pickup') ||
    tit.startsWith('bulk waste pickup') ||
    tit.includes('bulk waste pickup')
  )
}
