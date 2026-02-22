'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FAQItem } from '@/lib/types'
import { getFAQItems } from '@/lib/api'

const popularQuestions: { question: string; answer: string }[] = [
  {
    question: 'How is my tier calculated?',
    answer:
      'Your tier is based on two factors: your 3-month rolling balance (average of your balance on the last day of each month for the past 3 months) and your number of active autopays. Meeting both thresholds qualifies you for the tier.',
  },
  {
    question: "What's a rolling balance?",
    answer:
      'Your rolling balance is the average of your account balance on the last day of each of the past 3 months. For example, if your balance was $2,600 on January 31, $2,500 on February 28, and $2,400 on March 31, your rolling balance would be $2,500.',
  },
  {
    question: 'Can I have multiple autopays?',
    answer:
      'Yes! You can have as many autopays as you need. Each qualifying autopay (loan payments, bill payments, or credit card payments) counts toward your tier requirement. Note that credit card autopays are limited to 1 per tier for Plus, and 2 for Premium.',
  },
]

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FAQItem[]>([])
  const [searching, setSearching] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const results = await getFAQItems(undefined, query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const displayQuestions =
    searchQuery.trim().length >= 2
      ? searchResults.map((r) => ({ question: r.question, answer: r.answer }))
      : popularQuestions

  return (
    <section aria-label="Frequently asked questions">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Have Questions?</h2>

      <div className="mb-4">
        <label htmlFor="faq-search" className="sr-only">
          Search FAQs
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="faq-search"
            type="search"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[48px]"
            aria-describedby="faq-search-status"
          />
        </div>
        <div id="faq-search-status" className="sr-only" aria-live="polite">
          {searching
            ? 'Searching...'
            : searchQuery.trim().length >= 2
              ? `${searchResults.length} results found`
              : ''}
        </div>
      </div>

      <div className="space-y-2" role="list">
        {displayQuestions.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
            role="listitem"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex items-center justify-between p-4 text-left text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors min-h-[48px]"
              aria-expanded={expandedIndex === index}
            >
              <span>{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedIndex === index && (
              <div className="px-4 pb-4 text-base text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {searchQuery.trim().length >= 2 && searchResults.length === 0 && !searching && (
        <p className="text-base text-gray-500 mt-3 text-center">
          No results found. Try a different search term.
        </p>
      )}

      <div className="mt-4">
        <Link
          href="/loyalty/faq"
          className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
        >
          Browse all FAQs (25+ questions)
          <svg
            className="w-5 h-5 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}
