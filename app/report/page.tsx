'use client'

import { supabase } from '@/lib/supabase'
import { CitizenView } from '@/components/cleansync/citizen-view'
export { ReportIssueForm } from '@/components/cleansync/report-issue-form'
export { TrackComplaints } from '@/components/cleansync/track-complaints'

// Strip raw audit tags from visible text descriptions
export function stripAuditTags(text?: string | null): string {
  if (!text) return ''
  return text
    .replace(/\[VERIFIED:[^\]]*\]/gi, '')
    .replace(/\[FLAGGED:[^\]]*\]/gi, '')
    .replace(/\[VERIFIED\]/gi, '')
    .replace(/\[FLAGGED\]/gi, '')
    .trim()
}

// Inspect image file for camera EXIF metadata and live capture flags
export async function verifyCameraMetadata(file: File): Promise<boolean> {
  try {
    if (!file) return false

    const anyFile = file as any
    // 1. Direct exif-js or custom metadata properties
    const exifObj = anyFile.exifdata || anyFile.exif || anyFile.metadata
    if (exifObj) {
      if (exifObj.Make || exifObj.Model || exifObj.DateTimeOriginal || exifObj.GPSLatitude || exifObj.Software) {
        return true
      }
    }

    if (anyFile.isLiveCapture === true || anyFile.hasCameraMetadata === true) {
      return true
    }

    const lowerName = (file.name || '').toLowerCase()

    // 2. Clear signs of downloaded / screenshot / scrubbed files
    if (
      lowerName.includes('screenshot') ||
      lowerName.includes('screen_shot') ||
      lowerName.includes('download') ||
      lowerName.includes('whatsapp') ||
      lowerName.includes('saved') ||
      lowerName.includes('internet') ||
      lowerName.includes('facebook') ||
      lowerName.includes('reddit') ||
      lowerName.includes('twitter')
    ) {
      return false
    }

    // 3. Inspect binary slice for JPEG APP1 (0xFFE1) EXIF header
    if (file.size > 12) {
      const slice = file.slice(0, Math.min(file.size, 131072)) // First 128KB
      const buffer = await slice.arrayBuffer()
      const bytes = new Uint8Array(buffer)

      // Look for JPEG SOI (0xFF, 0xD8)
      if (bytes[0] === 0xff && bytes[1] === 0xd8) {
        let offset = 2
        while (offset < bytes.length - 4) {
          if (bytes[offset] !== 0xff) break
          const marker = bytes[offset + 1]

          // 0xFFE1 is APP1 (EXIF)
          if (marker === 0xe1) {
            const length = (bytes[offset + 2] << 8) | bytes[offset + 3]
            // Verify 'Exif\0\0'
            const isExifHeader =
              bytes[offset + 4] === 0x45 && // E
              bytes[offset + 5] === 0x78 && // x
              bytes[offset + 6] === 0x69 && // i
              bytes[offset + 7] === 0x66 && // f
              bytes[offset + 8] === 0x00 &&
              bytes[offset + 9] === 0x00

            if (isExifHeader) {
              const segStart = offset + 10
              const segEnd = Math.min(offset + 2 + length, bytes.length)
              const segBytes = bytes.slice(segStart, segEnd)
              const text = new TextDecoder('latin1').decode(segBytes)

              // Check for camera manufacturers and hardware tags
              const cameraSignatures = [
                'Apple', 'iPhone', 'Samsung', 'Google', 'Pixel', 'Sony',
                'Canon', 'Nikon', 'Xiaomi', 'OnePlus', 'Huawei', 'Motorola',
                'Oppo', 'Vivo', 'HMD', 'Nokia', 'Realme', 'Asus',
                'Make', 'Model', 'DateTimeOriginal',
              ]

              for (const sig of cameraSignatures) {
                if (text.includes(sig)) {
                  return true
                }
              }

              // Also check TIFF tag IDs directly in little-endian or big-endian:
              const isLE = bytes[segStart] === 0x49 && bytes[segStart + 1] === 0x49
              const isBE = bytes[segStart] === 0x4d && bytes[segStart + 1] === 0x4d

              if (isLE || isBE) {
                for (let i = 0; i < segBytes.length - 4; i++) {
                  const tagId = isLE
                    ? (segBytes[i + 1] << 8) | segBytes[i]
                    : (segBytes[i] << 8) | segBytes[i + 1]
                  if (tagId === 0x010f || tagId === 0x0110 || tagId === 0x9003 || tagId === 0x8825) {
                    return true
                  }
                }
              }
            }
            break
          }
          const length = (bytes[offset + 2] << 8) | bytes[offset + 3]
          if (length <= 0) break
          offset += 2 + length
        }
      }
    }

    // 4. Live camera capture detection via file properties:
    const isVeryRecent = Math.abs(Date.now() - file.lastModified) < 180_000 // 3 minutes
    const isCameraNamePattern =
      /^image\.(jpe?g|png)$/i.test(file.name) ||
      /^img_\d+/i.test(file.name) ||
      /^photo[\-_]/i.test(file.name) ||
      /^camera/i.test(file.name) ||
      /^capture/i.test(file.name)

    if (isVeryRecent && isCameraNamePattern) {
      return true
    }

    return false
  } catch {
    return false
  }
}

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
  isDeviceVerified,
  hasCameraMetadata,
}: any) {
  let finalDescription = description || ''

  // If description doesn't already contain an audit flag, append based on verification
  if (!finalDescription.includes('[VERIFIED') && !finalDescription.includes('[FLAGGED')) {
    const isVerified = Boolean(isDeviceVerified ?? hasCameraMetadata)
    const auditTag = isVerified
      ? '[VERIFIED: Hardware Live Capture]'
      : '[FLAGGED: Missing Camera EXIF]'
    const cleanDesc = stripAuditTags(finalDescription)
    finalDescription = cleanDesc ? `${cleanDesc} ${auditTag}` : auditTag
  }

  return await supabase.from('issues').insert([
    {
      title: title || `${category} Report`,
      category: category,
      description: finalDescription,
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

// File input onChange handler logic with resilient photo verification
export async function handleImageChange(
  e: React.ChangeEvent<HTMLInputElement> | File,
  setImageUrl: (val: string | null) => void,
  setIsDeviceVerified?: (val: boolean) => void
) {
  const file = (e as any)?.target?.files?.[0] || (e instanceof File ? e : null) || (e as any)?.file
  if (file) {
    let verified = false
    try {
      verified = await verifyCameraMetadata(file)
    } catch {
      verified = false
    }
    setIsDeviceVerified?.(verified)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    return verified
  }
  return false
}

// Citizen Dynamic SLA Indicator Badge
export function getSlaBadge(priority?: string) {
  const p = (priority || 'low').trim().toLowerCase()
  if (p === 'urgent') {
    return (
      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
        ⏱ SLA: Expected resolution in 2-4 hrs
      </span>
    )
  }
  if (p === 'medium') {
    return (
      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        ⏱ SLA: Expected resolution in 8-12 hrs
      </span>
    )
  }
  return (
    <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
      ⏱ SLA: Expected resolution in 24 hrs
    </span>
  )
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
