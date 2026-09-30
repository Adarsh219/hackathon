import type { Metadata } from 'next'
import { CitizenView } from '@/components/cleansync/citizen-view'

export const metadata: Metadata = {
  title: 'CleanSync Citizen Portal',
  description: 'Report issues, follow up on complaints, and book pickups — all in one place.',
}

export default function CitizenPage() {
  return <CitizenView />
}
