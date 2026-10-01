'use client'

import { supabase } from '@/lib/supabase'
import { CitizenView } from '@/components/cleansync/citizen-view'
export { ReportIssueForm } from '@/components/cleansync/report-issue-form'
export { TrackComplaints } from '@/components/cleansync/track-complaints'

// Form submission handler logic
export async function handleSubmit({
  title,
  category,
  description,
  location,
  ward,
  coords,
  priority,
  imageUrl,
  user,
}: any) {
  return await supabase.from('issues').insert([
    {
      title: title || `${category} Report`,
      category: category,
      description: description || '',
      location: location || ward || 'Ward 4',
      ward: ward || 'Ward 4',
      latitude: coords?.lat ?? 26.8467,
      longitude: coords?.lng ?? 80.9462,
      status: 'Pending',
      priority: priority || 'Medium',
      image_url: imageUrl || null,
      user_email: user?.email || 'citizen@spectrum.local'
    }
  ])
}

// File input onChange handler logic
export function handleImageChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setImageUrl: (val: string | null) => void
) {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

// Track My Complaints query
export async function fetchTrackedComplaints() {
  return await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })
}

export default function ReportPage() {
  return <CitizenView />
}
