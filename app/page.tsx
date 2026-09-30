import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { SiteFooter } from '@/components/landing/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <EcosystemSection />
      </main>
      <SiteFooter />
    </>
  )
}
