'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_PHOTOS = 4

type PhotoDropzoneProps = {
  files: File[]
  onChange: (files: File[]) => void
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBase64Change?: (base64: string | null) => void
}

export function PhotoDropzone({ files, onChange, onImageChange, onBase64Change }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews])

  function addFiles(list: FileList | null) {
    if (!list) return
    const images = Array.from(list).filter((f) => f.type.startsWith('image/'))
    onChange([...files, ...images].slice(0, MAX_PHOTOS))
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium" id="photo-label">
        Photos <span className="font-normal text-muted-foreground">(optional, up to {MAX_PHOTOS})</span>
      </span>
      <button
        type="button"
        aria-labelledby="photo-label"
        aria-describedby="photo-hint"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file && onBase64Change) {
            const reader = new FileReader()
            reader.onloadend = () => {
              onBase64Change(reader.result as string)
            }
            reader.readAsDataURL(file)
          }
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          dragging ? 'border-primary bg-accent' : 'border-border bg-muted/40 hover:border-primary/50 hover:bg-accent/60',
        )}
      >
        <div className="flex items-center gap-2 text-primary">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent">
            <Camera className="size-5" aria-hidden="true" />
          </span>
          <span className="flex size-11 items-center justify-center rounded-full bg-accent">
            <ImagePlus className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">
            Drag &amp; drop photos here, or <span className="text-primary underline underline-offset-4">browse</span>
          </p>
          <p id="photo-hint" className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or HEIC. Clear photos help crews respond faster.
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        id="issue-photo"
        name="photo"
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          onImageChange?.(e)
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />
      {files.length > 0 && (
        <ul className="grid grid-cols-4 gap-2" aria-label="Selected photos">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border">
              <img src={previews[i] || '/placeholder.svg'} alt={file.name} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  const updated = files.filter((_, idx) => idx !== i)
                  onChange(updated)
                  if (updated.length === 0) {
                    onBase64Change?.(null)
                  } else {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      onBase64Change?.(reader.result as string)
                    }
                    reader.readAsDataURL(updated[0])
                  }
                }}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-foreground/80 text-background transition-opacity hover:bg-foreground"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
