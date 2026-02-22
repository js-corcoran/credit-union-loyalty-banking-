'use client'

import { useRouter } from 'next/navigation'
import { LoyaltySummaryBenefit } from '@/lib/api'
import { BenefitCard } from './BenefitCard'

interface BenefitsSummaryRegionProps {
  benefits: LoyaltySummaryBenefit[]
}

export function BenefitsSummaryRegion({ benefits }: BenefitsSummaryRegionProps) {
  const router = useRouter()

  return (
    <section aria-label="Your benefits">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <BenefitCard
            key={benefit.benefitId}
            benefitName={benefit.benefitName}
            benefitType={benefit.benefitType}
            description={benefit.description}
            annualValue={benefit.annualValue}
            personalizationNote={benefit.personalizationNote}
            onClick={() => router.push('/loyalty/benefits')}
          />
        ))}
      </div>
    </section>
  )
}
