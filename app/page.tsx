import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { SiteFooter } from '@/components/landing/site-footer'
import { WasteAwarenessSection } from '@/components/landing/waste-awareness-section'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <WasteAwarenessSection />
        <EcosystemSection />
      </main>
      <SiteFooter />
    </>
  )
}

