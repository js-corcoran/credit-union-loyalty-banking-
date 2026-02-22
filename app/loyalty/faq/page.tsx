'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getFAQItems } from '@/lib/api'
import { FAQItem } from '@/lib/types'
import { Header } from '@/components/layout/Header'
import { FAQItemCard } from '@/components/loyalty/FAQItemCard'
import { Button } from '@/components/shared/Button'

type FAQCategory = 'all' | 'qualification' | 'benefits' | 'retrogression' | 'legacy-migration' | 'troubleshooting'

const categories: { value: FAQCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'qualification', label: 'Tier Qualification' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'retrogression', label: 'Retrogression' },
  { value: 'legacy-migration', label: 'Legacy Migration' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
]

function FAQSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-busy="true" aria-label="Loading FAQs">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border border-gray-200 rounded-xl bg-white p-5">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

export default function FAQPage() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const faqListRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getFAQItems()
      setAllFaqs(result)
    } catch {
      setError('Unable to load FAQs. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter FAQs by category and search
  const filteredFaqs = useCallback(() => {
    let results = allFaqs

    // Category filter
    if (activeCategory !== 'all') {
      results = results.filter((faq) => faq.category === activeCategory)
    }

    // Search filter
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
    // Expand the related FAQ
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(faqId)
      return next
    })

    // Scroll to the FAQ item
    setTimeout(() => {
      const element = document.getElementById(`faq-item-${faqId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }, 100)
  }

  const handleCategoryChange = (category: FAQCategory) => {
    setActiveCategory(category)
    setSearchQuery('')
    setExpandedIds(new Set())
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setExpandedIds(new Set())
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
            <li>
              <Link href="/loyalty" className="hover:text-gray-700 hover:underline">Loyalty</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-900 font-medium">FAQ</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-gray-600 mb-6">
          Find answers to common questions about your loyalty tier, benefits, and more
        </p>

        {/* Search Region */}
        <div className="mb-6">
          <div className="relative max-w-[600px]">
            <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
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
              id="faq-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search FAQs..."
              className="w-full h-12 pl-10 pr-10 text-base border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search FAQs"
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

          {/* Search result count */}
          {searchQuery.trim().length >= 2 && (
            <div className="mt-2" aria-live="polite">
              <p className="text-sm text-gray-500">
                {displayedFaqs.length} result{displayedFaqs.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                {activeCategory !== 'all' && ` in ${categories.find((c) => c.value === activeCategory)?.label}`}
              </p>
            </div>
          )}
        </div>

        {/* Category Navigation */}
        <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <nav aria-label="FAQ categories">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap" role="tablist">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.value
                return (
                  <button
                    key={cat.value}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Loading */}
        {loading && <FAQSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-base text-red-800 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchData}>Retry</Button>
          </div>
        )}

        {/* FAQ List */}
        {!loading && !error && (
          <div ref={faqListRef}>
            {displayedFaqs.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-base text-gray-600 mb-2">
                  {searchQuery.trim().length >= 2
                    ? `No FAQs match "${searchQuery}". Try different keywords or browse by category.`
                    : 'No FAQs in this category.'}
                </p>
                {searchQuery && (
                  <button
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium min-h-[48px] inline-flex items-center"
                    onClick={handleClearSearch}
                  >
                    Clear search and browse all FAQs
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label="FAQ list">
                {displayedFaqs.map((faq) => (
                  <div
                    key={faq.faqId}
                    id={`faq-item-${faq.faqId}`}
                    role="listitem"
                    tabIndex={-1}
                  >
                    <FAQItemCard
                      faq={faq}
                      expanded={expandedIds.has(faq.faqId)}
                      onToggle={() => handleToggle(faq.faqId)}
                      onRelatedClick={handleRelatedClick}
                      searchTerm={searchQuery.trim().length >= 2 ? searchQuery : undefined}
                      allFaqs={allFaqs}
                      memberRollingBalance={14500}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support CTA */}
        {!loading && !error && (
          <section aria-label="Need more help" className="mt-10 bg-gray-50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Didn&apos;t find your answer?
            </h2>
            <p className="text-base text-gray-600 mb-4">
              Our support team is here to help with any questions about your loyalty program.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/help">
                <Button variant="primary" size="md">
                  Contact Support
                </Button>
              </Link>
              <a href="mailto:support@creditunion.example.com">
                <Button variant="outline" size="md">
                  Email Us
                </Button>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Phone: 1-800-555-0100 (Mon-Fri, 8 AM - 6 PM)
            </p>
          </section>
        )}
      </main>
    </>
  )
}
