import { Member, FAQItem } from './types'

export const mockMember1: Member = {
  memberId: 'MEMBER-001',
  firstName: 'Patricia',
  lastName: 'Johnson',
  email: 'patricia.johnson@email.com',
  phoneNumber: '555-0100',
  currentTier: 'plus',
  tierChangeDate: new Date('2025-11-15'),
  joinDate: new Date('2010-03-20'),
  qualifyingAccounts: [
    {
      accountId: 'CHK-9876',
      accountType: 'checking',
      currentBalance: 15000,
      rollingBalance3Month: 14500,
      qualifiesForTier: true,
      contributesToTier: ['classic', 'plus', 'premium'],
    },
    {
      accountId: 'SAV-5432',
      accountType: 'savings',
      currentBalance: 8500,
      rollingBalance3Month: 8200,
      qualifiesForTier: true,
      contributesToTier: ['classic', 'plus'],
    },
  ],
  autopayStatus: {
    loanAutopay: true,
    creditCardAutopay: false,
    billPaymentAutopay: true,
    totalCount: 2,
    autopayDetails: [
      {
        autopayId: 'AP-001',
        accountId: 'LOAN-001',
        payeeType: 'loan',
        amount: 1250,
        frequency: 'monthly',
        expirationDate: new Date('2026-05-31'),
        status: 'active',
        contributesToTier: ['classic', 'plus', 'premium'],
      },
      {
        autopayId: 'AP-002',
        accountId: 'CHK-9876',
        payeeType: 'bill',
        amount: 150,
        frequency: 'monthly',
        expirationDate: new Date('2027-02-28'),
        status: 'active',
        contributesToTier: ['classic', 'plus', 'premium'],
      },
    ],
  },
  notificationPreferences: {
    frequencyPreference: 'weekly',
    preferredChannels: ['in-app', 'email'],
    notificationTypePreferences: {
      tierAchievement: true,
      retrogressionRisk: true,
      autopayExpiration: true,
      balanceThreshold: false,
    },
  },
  lastLoginDate: new Date('2026-02-20'),
}

export const mockFAQItems: FAQItem[] = [
  // === QUALIFICATION (6 questions) ===
  {
    faqId: 'FAQ-001',
    question: 'What is a rolling balance?',
    answer:
      'Your rolling balance is the average of your account balance on the last day of each of the past 3 months. For example, if your balance was $2,600 on January 31, $2,500 on February 28, and $2,400 on March 31, your rolling balance would be $2,500. We recalculate this daily so your tier status is always up to date.',
    category: 'qualification',
    keywords: ['rolling', 'balance', 'calculation', 'three-month', 'average'],
    relatedFAQIds: ['FAQ-002', 'FAQ-006'],
    visualExplanation: {
      type: 'diagram',
      url: '/images/rolling-balance-diagram.svg',
      altText: 'Visual explanation of rolling 3-month balance calculation',
    },
    relevantTiers: ['classic', 'plus', 'premium'],
    exampleMember: {
      balance: 8500,
      autopayCount: 2,
      expectedTier: 'plus',
    },
  },
  {
    faqId: 'FAQ-002',
    question: 'How do I qualify for Plus tier?',
    answer:
      'To qualify for Plus tier, you need two things: (1) maintain a 3-month rolling balance of $10,000 or more across your qualifying accounts (checking, savings, money market), AND (2) maintain at least 2 active autopays. Autopays can be loan payments, bill payments, or credit card payments, but only 1 credit card autopay counts per tier level.',
    category: 'qualification',
    keywords: ['qualify', 'plus', 'requirements', 'autopay', 'balance'],
    relatedFAQIds: ['FAQ-001', 'FAQ-003'],
    relevantTiers: ['plus'],
    exampleMember: {
      balance: 15000,
      autopayCount: 2,
      expectedTier: 'plus',
    },
  },
  {
    faqId: 'FAQ-003',
    question: 'How is my tier calculated?',
    answer:
      'Your tier is determined by two factors: your 3-month rolling balance and your number of active autopays. Classic tier requires $2,500 balance and 1 autopay. Plus tier requires $10,000 balance and 2 autopays. Premium tier requires $25,000 balance and 3 autopays. Both conditions must be met simultaneously to qualify for a tier.',
    category: 'qualification',
    keywords: ['tier', 'calculated', 'formula', 'determine', 'how'],
    relatedFAQIds: ['FAQ-001', 'FAQ-002'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-004',
    question: 'Can I have multiple autopays count toward my tier?',
    answer:
      'Yes! You can set up multiple autopays to meet tier requirements. Loan payments, bill payments, and credit card autopays all count. However, there is a limit of 1 credit card autopay per tier level. For example, Plus tier requires 2 autopays, and at most 1 can be a credit card payment.',
    category: 'qualification',
    keywords: ['multiple', 'autopay', 'count', 'limit', 'credit card'],
    relatedFAQIds: ['FAQ-002', 'FAQ-005'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-005',
    question: 'What happens if I remove an autopay?',
    answer:
      'If removing an autopay causes you to fall below your tier\'s minimum autopay requirement, you will enter a 30-day grace period. During this time, you keep all your current tier benefits. If you set up a new qualifying autopay within 30 days, your tier is preserved. Otherwise, your tier will adjust after the grace period ends.',
    category: 'qualification',
    keywords: ['remove', 'autopay', 'cancel', 'delete', 'grace period'],
    relatedFAQIds: ['FAQ-004', 'FAQ-013'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-006',
    question: 'When does my tier change?',
    answer:
      'Your tier is evaluated daily based on your 3-month rolling balance and active autopays. If you meet the requirements for a higher tier, you are upgraded immediately. If you fall below requirements, you enter a 30-day grace period before any downgrade occurs. You will receive alerts at 30, 14, and 7 days before a potential downgrade.',
    category: 'qualification',
    keywords: ['when', 'change', 'upgrade', 'downgrade', 'timing', 'daily'],
    relatedFAQIds: ['FAQ-003', 'FAQ-013'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },

  // === BENEFITS (6 questions) ===
  {
    faqId: 'FAQ-007',
    question: 'What is the APY boost benefit?',
    answer:
      'The APY boost increases the annual percentage yield on your savings and money market accounts. Classic tier earns +0.10% APY, Plus tier earns +0.25% APY, and Premium tier earns +0.50% APY. This is calculated on your total qualifying balance. For example, with a $23,500 balance and Plus tier, you earn an extra $58.75 per year.',
    category: 'benefits',
    keywords: ['apy', 'boost', 'interest', 'savings', 'percentage', 'earn'],
    relatedFAQIds: ['FAQ-008', 'FAQ-012'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-008',
    question: 'How much will I save with fee waivers?',
    answer:
      'Fee waivers eliminate transfer fees that would otherwise apply. The typical fee per transfer is $2.50. If you make about 2 transfers per month, that saves you $60 per year with Plus or Premium tier. Classic tier waives standard ATM fees. Premium tier also waives foreign ATM fees, adding approximately $36 per year in additional savings.',
    category: 'benefits',
    keywords: ['fee', 'waiver', 'save', 'transfer', 'cost', 'free'],
    relatedFAQIds: ['FAQ-007', 'FAQ-009'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-009',
    question: 'What are third-party rewards?',
    answer:
      'Third-party rewards let you earn bonus points when shopping at partner retailers for groceries, gas, and dining. Plus tier earns 2X points and Premium tier earns 3X points on qualifying purchases. Points can be redeemed for cash back, gift cards, or charitable donations through our RetailPoints Partnership Network.',
    category: 'benefits',
    keywords: ['rewards', 'points', 'partner', 'third-party', 'shopping', 'earn'],
    relatedFAQIds: ['FAQ-010', 'FAQ-007'],
    relevantTiers: ['plus', 'premium'],
  },
  {
    faqId: 'FAQ-010',
    question: 'How do partner rewards work?',
    answer:
      'When you make purchases at participating partner retailers, you automatically earn bonus points based on your tier. Points are tracked through our RetailPoints Partnership Network. You can view your points balance and redeem them anytime. Points are calculated based on your purchase amount multiplied by your tier\'s points multiplier.',
    category: 'benefits',
    keywords: ['partner', 'rewards', 'how', 'work', 'earn', 'redeem', 'points'],
    relatedFAQIds: ['FAQ-009', 'FAQ-011'],
    relevantTiers: ['plus', 'premium'],
  },
  {
    faqId: 'FAQ-011',
    question: 'Which benefits apply to my tier?',
    answer:
      'Classic tier includes APY boost (+0.10%) and standard fee waivers. Plus tier includes APY boost (+0.25%), transfer fee waivers, and 2X partner rewards. Premium tier includes APY boost (+0.50%), transfer and foreign ATM fee waivers, and 3X partner rewards with priority support. Visit the Benefits page for your personalized dollar values.',
    category: 'benefits',
    keywords: ['which', 'benefits', 'tier', 'apply', 'include', 'my'],
    relatedFAQIds: ['FAQ-007', 'FAQ-008'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-012',
    question: 'Do my benefits change if I downgrade?',
    answer:
      'If your tier downgrades, your benefits adjust to match your new tier level. However, you first enter a 30-day grace period where you keep your current benefits while you work to restore your tier. During this time, all existing benefits remain active. After the grace period, benefits adjust to your new tier level.',
    category: 'benefits',
    keywords: ['downgrade', 'benefits', 'change', 'lose', 'keep', 'grace'],
    relatedFAQIds: ['FAQ-013', 'FAQ-014'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },

  // === RETROGRESSION (5 questions) ===
  {
    faqId: 'FAQ-013',
    question: 'What is the grace period?',
    answer:
      'The grace period is a 30-day window that starts when your account no longer meets your current tier\'s requirements. During these 30 days, you keep all your current tier benefits. This gives you time to restore your balance or set up additional autopays. If you meet the requirements again within 30 days, your tier is preserved with no interruption.',
    category: 'retrogression',
    keywords: ['grace', 'period', '30 days', 'window', 'time', 'keep'],
    relatedFAQIds: ['FAQ-014', 'FAQ-015'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-014',
    question: 'What happens if I lose my tier?',
    answer:
      'If your rolling balance drops below your tier\'s minimum or your autopay count falls below the requirement for 30 consecutive days, your tier will adjust to the level you currently qualify for. You will receive alerts at 30, 14, and 7 days before any change. You can always re-qualify by meeting the requirements again.',
    category: 'retrogression',
    keywords: ['lose', 'tier', 'downgrade', 'drop', 'what happens'],
    relatedFAQIds: ['FAQ-013', 'FAQ-015'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-015',
    question: 'Can I recover my tier status?',
    answer:
      'Yes, absolutely. If your tier has been downgraded, you can re-qualify by meeting the balance and autopay requirements for your desired tier. Once both requirements are met, your tier upgrade takes effect immediately. There is no waiting period to re-qualify after a downgrade.',
    category: 'retrogression',
    keywords: ['recover', 'restore', 'requalify', 'upgrade', 'again'],
    relatedFAQIds: ['FAQ-014', 'FAQ-016'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-016',
    question: 'How long is the grace period?',
    answer:
      'The grace period is exactly 30 days from the date your account first falls below tier requirements. You will receive proactive alerts at the 30-day mark (when grace period starts), at 14 days remaining, and at 7 days remaining. This gives you multiple opportunities to take action before any tier change occurs.',
    category: 'retrogression',
    keywords: ['how long', 'grace', 'period', 'days', 'duration'],
    relatedFAQIds: ['FAQ-013', 'FAQ-014'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-017',
    question: 'Do I lose my benefits during the grace period?',
    answer:
      'No, you keep all your current tier benefits throughout the entire 30-day grace period. Your APY boost, fee waivers, and partner rewards all remain active. This is designed to give you time to restore your tier without any disruption to your banking experience.',
    category: 'retrogression',
    keywords: ['benefits', 'grace', 'period', 'keep', 'lose', 'during'],
    relatedFAQIds: ['FAQ-013', 'FAQ-012'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },

  // === LEGACY MIGRATION (4 questions) ===
  {
    faqId: 'FAQ-018',
    question: 'Why did the loyalty program change?',
    answer:
      'We redesigned the loyalty program to provide more transparent, real-dollar benefits to our members. The new three-tier system (Classic, Plus, Premium) replaces the previous program with clearer qualification rules, higher benefit values, and personalized benefit calculations so you always know exactly what you are earning.',
    category: 'legacy-migration',
    keywords: ['why', 'change', 'new', 'program', 'redesign', 'replace'],
    relatedFAQIds: ['FAQ-019', 'FAQ-020'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-019',
    question: 'Why are the new tier thresholds higher?',
    answer:
      'The new tier thresholds are higher because the benefits are significantly more valuable. For example, the old program offered approximately $25 per year in benefits, while the new Plus tier provides approximately $145 per year. The higher thresholds reflect this increased value. Most members who were active in the old program already meet the new Classic tier requirements.',
    category: 'legacy-migration',
    keywords: ['threshold', 'higher', 'why', 'requirements', 'new', 'old'],
    relatedFAQIds: ['FAQ-018', 'FAQ-020'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-020',
    question: 'How do the new benefits compare to the old program?',
    answer:
      'The new program provides substantially more value. Classic tier: ~$50/year in benefits (up from ~$25/year). Plus tier: ~$145/year in benefits (new). Premium tier: ~$280/year in benefits (new). Benefits now include real-dollar APY boosts, fee waivers, and partner rewards, all calculated based on your actual account activity.',
    category: 'legacy-migration',
    keywords: ['compare', 'old', 'new', 'benefits', 'difference', 'value'],
    relatedFAQIds: ['FAQ-018', 'FAQ-021'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-021',
    question: 'Can I go back to the old program?',
    answer:
      'The old program has been fully replaced by the new three-tier loyalty program. All members have been migrated to the new system. The good news is that the new program provides higher benefit values and more transparency. If you have concerns about your new tier placement, please contact our support team and we will review your account.',
    category: 'legacy-migration',
    keywords: ['old', 'program', 'back', 'return', 'previous', 'switch'],
    relatedFAQIds: ['FAQ-018', 'FAQ-020'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },

  // === TROUBLESHOOTING (5 questions) ===
  {
    faqId: 'FAQ-022',
    question: 'My tier is showing incorrectly. Why?',
    answer:
      'Tier status is recalculated daily based on your 3-month rolling balance and autopay count. If your tier seems incorrect, check your Account Status page to see the exact calculation. Common reasons for unexpected tier status include recent balance changes that have not yet averaged into the 3-month window, or expired autopays. If you believe there is an error, please contact support.',
    category: 'troubleshooting',
    keywords: ['incorrect', 'wrong', 'tier', 'showing', 'error', 'why'],
    relatedFAQIds: ['FAQ-023', 'FAQ-003'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-023',
    question: 'I think my balance was miscalculated. What do I do?',
    answer:
      'First, check your Account Status page to see the detailed balance breakdown for each qualifying account. Remember that the rolling balance uses the average of your end-of-month balances for the past 3 months, not your current balance. If you still believe there is an error, contact our support team with your account details and we will investigate.',
    category: 'troubleshooting',
    keywords: ['miscalculated', 'balance', 'wrong', 'error', 'incorrect', 'dispute'],
    relatedFAQIds: ['FAQ-001', 'FAQ-022'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-024',
    question: 'Why can\'t I add more autopays?',
    answer:
      'There are limits on certain autopay types per tier. Specifically, only 1 credit card autopay can count toward tier qualification per tier level. If you already have a credit card autopay set up, additional credit card autopays will not count. However, you can add unlimited loan and bill payment autopays. Check your Autopay page for current status.',
    category: 'troubleshooting',
    keywords: ['autopay', 'add', 'limit', 'cannot', 'more', 'credit card'],
    relatedFAQIds: ['FAQ-004', 'FAQ-005'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-025',
    question: 'How do I verify my rolling balance?',
    answer:
      'Visit the Account Status page under the Loyalty section. There you will see a detailed breakdown showing each qualifying account, its current balance, its 3-month rolling balance, and how it contributes to your tier qualification. The page also shows the calculation formula and your total qualifying balance.',
    category: 'troubleshooting',
    keywords: ['verify', 'check', 'rolling', 'balance', 'confirm', 'see'],
    relatedFAQIds: ['FAQ-001', 'FAQ-023'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
  {
    faqId: 'FAQ-026',
    question: 'What if I have a question not in the FAQ?',
    answer:
      'If you cannot find the answer to your question here, we are happy to help. You can contact our support team by phone at 1-800-555-0100 (Monday through Friday, 8 AM to 6 PM), by email at support@creditunion.example.com, or through the live chat feature available on our Help page. Our team is trained on all loyalty program details.',
    category: 'troubleshooting',
    keywords: ['question', 'help', 'support', 'contact', 'not found', 'other'],
    relatedFAQIds: ['FAQ-022', 'FAQ-023'],
    relevantTiers: ['classic', 'plus', 'premium'],
  },
]

export function getMockMember(memberId: string): Member {
  return mockMember1
}
