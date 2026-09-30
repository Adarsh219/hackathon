export type AdminStatus = 'Pending' | 'In Progress' | 'Dispatched' | 'Resolved'

export type AdminTicket = {
  id: string
  category: string
  location: string
  ward: string
  reportedAt: string
  status: AdminStatus
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
  { id: 'ISS-1284', category: 'Illegal Dumping', location: 'Sector 4 Market, Gate 2', ward: 'Ward 4', reportedAt: '2026-09-30T08:42:00', status: 'Pending' },
  { id: 'ISS-1283', category: 'Overflowing Bin', location: 'Station Road, Bus Stand', ward: 'Ward 7', reportedAt: '2026-09-30T08:15:00', status: 'In Progress', crew: 'Crew Alpha' },
  { id: 'ISS-1282', category: 'Garbage on Road', location: 'Riverside Walk, Pier 3', ward: 'Ward 9', reportedAt: '2026-09-30T07:58:00', status: 'Pending' },
  { id: 'ISS-1281', category: 'Dead Animal', location: 'NH-48 Service Lane', ward: 'Ward 12', reportedAt: '2026-09-30T07:31:00', status: 'Dispatched', crew: 'Crew Delta' },
  { id: 'ISS-1280', category: 'Missed Pickup', location: 'Old Town, Lane 14', ward: 'Ward 3', reportedAt: '2026-09-30T06:47:00', status: 'Resolved' },
  { id: 'ISS-1279', category: 'Overflowing Bin', location: 'Sector 4 Market, Fish Stall', ward: 'Ward 4', reportedAt: '2026-09-29T22:10:00', status: 'In Progress', crew: 'Crew Bravo' },
  { id: 'ISS-1278', category: 'Construction Debris', location: 'Industrial Area Phase 2', ward: 'Ward 12', reportedAt: '2026-09-29T19:26:00', status: 'Pending' },
  { id: 'ISS-1277', category: 'Illegal Dumping', location: 'Station Road, Flyover', ward: 'Ward 7', reportedAt: '2026-09-29T17:02:00', status: 'Pending' },
  { id: 'ISS-1276', category: 'Drain Blockage', location: 'Riverside Colony, Block C', ward: 'Ward 9', reportedAt: '2026-09-29T15:40:00', status: 'Resolved' },
  { id: 'ISS-1275', category: 'Garbage on Road', location: 'Clock Tower Circle', ward: 'Ward 3', reportedAt: '2026-09-29T13:18:00', status: 'In Progress', crew: 'Crew Charlie' },
  { id: 'ISS-1274', category: 'E-waste Dumping', location: 'Industrial Area Phase 1', ward: 'Ward 12', reportedAt: '2026-09-29T11:05:00', status: 'Dispatched', crew: 'Crew Alpha' },
  { id: 'ISS-1273', category: 'Missed Pickup', location: 'Sector 4, Housing Block B', ward: 'Ward 4', reportedAt: '2026-09-29T09:47:00', status: 'Resolved' },
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
