import type { Metadata } from 'next'
import { TopBar } from '@/components/cleansync/top-bar'
import { CitizenPortal } from '@/components/cleansync/citizen-portal'

export const metadata: Metadata = {
  title: 'CleanSync Citizen Portal',
  description: 'Report issues, follow up on complaints, and book pickups — all in one place.',
}

export default function CitizenPage() {
  return (
    <div className="min-h-dvh bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Keep your neighbourhood clean
          </h1>
          <p className="text-sm text-muted-foreground text-pretty sm:text-base">
            Report issues, follow up on complaints, and book pickups — all in one place.
          </p>
        </div>
        <CitizenPortal />
      </main>
    </div>
  )
}
