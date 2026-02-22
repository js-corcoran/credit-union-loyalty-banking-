'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { getFAQItems, getSupportStatus, SupportStatus } from '@/lib/api'
import { FAQItem } from '@/lib/types'
import { Header } from '@/components/layout/Header'
import { FAQItemCard } from '@/components/loyalty/FAQItemCard'
import { SupportCard } from '@/components/help/SupportCard'
import { Button } from '@/components/shared/Button'

type FAQCategory = 'all' | 'qualification' | 'benefits' | 'retrogression' | 'legacy-migration' | 'troubleshooting'

const categoryLabels: Record<string, string> = {
  qualification: 'Tier Qualification',
  benefits: 'Benefits & Value',
  retrogression: 'Changes & Retrogression',
  'legacy-migration': 'Legacy Migration',
  troubleshooting: 'Billing & Technical',
}

function HelpSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading help center">
      <div className="h-12 max-w-[600px] bg-gray-200 rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl bg-white p-5">
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl bg-white p-5 h-40" />
        ))}
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([])
  const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const searchRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [faqs, support] = await Promise.all([
        getFAQItems(),
        getSupportStatus(),
      ])
      setAllFaqs(faqs)
      setSupportStatus(support)
    } catch {
      setError('Unable to load help content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Focus search on load
  useEffect(() => {
    if (!loading && searchRef.current) {
      searchRef.current.focus()
    }
  }, [loading])

  // Filter FAQs
  const filteredFaqs = useCallback(() => {
    let results = allFaqs

    if (activeCategory !== 'all') {
      results = results.filter((faq) => faq.category === activeCategory)
    }

    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.keywords.some((k) => k.toLowerCase().includes(query))
      )
    }

    return results
  }, [allFaqs, activeCategory, searchQuery])

  const displayedFaqs = filteredFaqs()

  // Group FAQs by category for accordion display
  const groupedFaqs = useCallback(() => {
    const groups: Record<string, FAQItem[]> = {}
    for (const faq of displayedFaqs) {
      if (!groups[faq.category]) {
        groups[faq.category] = []
      }
      groups[faq.category].push(faq)
    }
    return groups
  }, [displayedFaqs])

  const faqGroups = groupedFaqs()
  const isSearching = searchQuery.trim().length >= 2

  const handleToggle = (faqId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(faqId)) {
        next.delete(faqId)
      } else {
        next.add(faqId)
      }
      return next
    })
  }

  const handleRelatedClick = (faqId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(faqId)
      return next
    })
    setTimeout(() => {
      const element = document.getElementById(`help-faq-item-${faqId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }, 100)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setExpandedIds(new Set())
    searchRef.current?.focus()
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClearSearch()
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">Help</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Help &amp; Support
        </h1>
        <p className="text-base text-gray-600 mb-6">
          Search our FAQ or contact support for help with your loyalty program
        </p>

        {loading && <HelpSkeleton />}

        {error && !loading && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
              <p className="text-base text-red-800 mb-4">{error}</p>
              <Button variant="primary" onClick={fetchData}>Retry</Button>
            </div>
            {/* Support section always visible even on error */}
            {supportStatus && (
              <SupportEscalation supportStatus={supportStatus} />
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Search Region */}
            <section aria-label="Search help topics">
              <div className="relative max-w-[600px]">
                <label htmlFor="help-search" className="sr-only">Search help topics</label>
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchRef}
                  id="help-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search FAQs... e.g., 'autopay', 'tier rules', 'APY'"
                  className="w-full h-12 pl-10 pr-10 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  aria-label="Search help topics"
                  aria-describedby="search-helper"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p id="search-helper" className="text-sm text-gray-500 mt-2">
                {allFaqs.length} frequently asked questions about loyalty tiers, benefits, and qualification
              </p>

              {isSearching && (
                <div className="mt-2" aria-live="polite">
                  <p className="text-sm text-gray-600">
                    {displayedFaqs.length === 0
                      ? `No results found for "${searchQuery}". Try different keywords or browse FAQs below.`
                      : `${displayedFaqs.length} result${displayedFaqs.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                  </p>
                </div>
              )}
            </section>

            {/* Category quick-filter pills (only when not searching) */}
            {!isSearching && (
              <nav aria-label="FAQ categories" className="-mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap" role="tablist">
                  {(['all', 'qualification', 'benefits', 'retrogression', 'legacy-migration', 'troubleshooting'] as FAQCategory[]).map((cat) => {
                    const isActive = activeCategory === cat
                    const label = cat === 'all' ? 'All Topics' : categoryLabels[cat] || cat
                    return (
                      <button
                        key={cat}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => {
                          setActiveCategory(cat)
                          setExpandedIds(new Set())
                        }}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </nav>
            )}

            {/* FAQ Accordion Region */}
            <section aria-label="Frequently Asked Questions">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

              {displayedFaqs.length === 0 && !isSearching ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-base text-gray-600">No FAQs in this category.</p>
                </div>
              ) : isSearching ? (
                /* Flat list when searching */
                <div className="space-y-3">
                  {displayedFaqs.map((faq) => (
                    <div key={faq.faqId} id={`help-faq-item-${faq.faqId}`} tabIndex={-1}>
                      <FAQItemCard
                        faq={faq}
                        expanded={expandedIds.has(faq.faqId)}
                        onToggle={() => handleToggle(faq.faqId)}
                        onRelatedClick={handleRelatedClick}
                        searchTerm={searchQuery}
                        allFaqs={allFaqs}
                        memberRollingBalance={14500}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Grouped by category when browsing */
                <div className="space-y-6">
                  {Object.entries(faqGroups).map(([category, faqs]) => (
                    <div key={category}>
                      <h3 className="text-base font-bold text-gray-700 mb-3 uppercase tracking-wide text-sm">
                        {categoryLabels[category] || category}
                      </h3>
                      <div className="space-y-3">
                        {faqs.map((faq) => (
                          <div key={faq.faqId} id={`help-faq-item-${faq.faqId}`} tabIndex={-1}>
                            <FAQItemCard
                              faq={faq}
                              expanded={expandedIds.has(faq.faqId)}
                              onToggle={() => handleToggle(faq.faqId)}
                              onRelatedClick={handleRelatedClick}
                              allFaqs={allFaqs}
                              memberRollingBalance={14500}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick link back to FAQ page */}
            <div className="text-center">
              <Link
                href="/loyalty/faq"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
              >
                View full Loyalty FAQ page
              </Link>
            </div>

            {/* Support Escalation */}
            {supportStatus && (
              <SupportEscalation supportStatus={supportStatus} />
            )}
          </div>
        )}
      </main>
    </>
  )
}

function SupportEscalation({ supportStatus }: { supportStatus: SupportStatus }) {
  return (
    <section aria-label="Contact support" className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
        Still need help?
      </h2>
      <p className="text-base text-gray-600 mb-6 text-center">
        Our team is here to assist you with any questions about your loyalty program.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Phone */}
        <SupportCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          title="Phone Support"
          description={supportStatus.phone.number}
          actionLabel="Call Us"
          actionHref={`tel:${supportStatus.phone.number.replace(/[^+\d]/g, '')}`}
          isAvailable={supportStatus.phone.isAvailable}
          availabilityText={supportStatus.phone.hoursToday}
        />

        {/* Email */}
        <SupportCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          title="Email Support"
          description={`Response within ${supportStatus.email.avgResponseTime}`}
          actionLabel="Email Us"
          actionHref={`mailto:${supportStatus.email.address}`}
          isAvailable={supportStatus.email.isAvailable}
          availabilityText="Always available"
        />

        {/* Chat */}
        <SupportCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          title="Live Chat"
          description="Chat with a representative"
          actionLabel={supportStatus.chat.isAvailable ? 'Start Chat' : 'Chat Offline'}
          isAvailable={supportStatus.chat.isAvailable}
          availabilityText={supportStatus.chat.hoursToday}
        />
      </div>
    </section>
  )
}
