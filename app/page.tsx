import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { SiteFooter } from '@/components/landing/site-footer'
import { AwarenessHub } from '@/components/cleansync/awareness-hub'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16">
          <div className="border border-slate-200/80 bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm">
            <AwarenessHub />
          </div>
        </section>
        <EcosystemSection />
      </main>
      <SiteFooter />
    </>
  )
}

