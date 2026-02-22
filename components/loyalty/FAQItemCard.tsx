'use client'

import { useEffect, useState } from 'react'
import { FAQItem } from '@/lib/types'
import { FAQVisualization } from './FAQVisualization'

interface FAQItemCardProps {
  faq: FAQItem
  expanded: boolean
  onToggle: () => void
  onRelatedClick: (faqId: string) => void
  searchTerm?: string
  allFaqs: FAQItem[]
  memberRollingBalance?: number
}

function highlightText(text: string, term: string): React.ReactNode {
  if (!term || term.length < 2) return text
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  )
}

function getPreview(answer: string): string {
  const sentences = answer.match(/[^.!?]+[.!?]+/g) || [answer]
  return sentences.slice(0, 2).join('').trim()
}

export function FAQItemCard({
  faq,
  expanded,
  onToggle,
  onRelatedClick,
  searchTerm,
  allFaqs,
  memberRollingBalance,
}: FAQItemCardProps) {
  const [vote, setVote] = useState<boolean | null>(null)
  const [showThanks, setShowThanks] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`faq_helpful_${faq.faqId}`)
    if (stored !== null) {
      setVote(stored === 'true')
    }
  }, [faq.faqId])

  const handleVote = (isHelpful: boolean) => {
    if (vote !== null) return
    setVote(isHelpful)
    localStorage.setItem(`faq_helpful_${faq.faqId}`, String(isHelpful))
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 2000)
  }

  const relatedFaqs = faq.relatedFAQIds
    .map((id) => allFaqs.find((f) => f.faqId === id))
    .filter(Boolean) as FAQItem[]

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        className="w-full text-left p-4 md:p-5 flex items-start gap-3 min-h-[48px] hover:bg-gray-50 transition-colors"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`faq-answer-${faq.faqId}`}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900">
            {searchTerm ? highlightText(faq.question, searchTerm) : faq.question}
          </h3>
          {!expanded && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {searchTerm ? highlightText(getPreview(faq.answer), searchTerm) : getPreview(faq.answer)}
            </p>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded answer */}
      <div
        id={`faq-answer-${faq.faqId}`}
        className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!expanded}
      >
        <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-100 pt-4 space-y-4">
          {/* Full answer */}
          <p className="text-base text-gray-700 leading-relaxed">
            {searchTerm ? highlightText(faq.answer, searchTerm) : faq.answer}
          </p>

          {/* Visualization */}
          {faq.visualExplanation && (
            <FAQVisualization
              type={faq.visualExplanation.type}
              memberRollingBalance={memberRollingBalance}
            />
          )}

          {/* Related questions */}
          {relatedFaqs.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">People also ask:</p>
              <ul className="space-y-1">
                {relatedFaqs.map((related) => (
                  <li key={related.faqId}>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline text-left min-h-[48px] inline-flex items-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRelatedClick(related.faqId)
                      }}
                      aria-label={`Related question: ${related.question}`}
                    >
                      {related.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Helpful voting */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Was this FAQ helpful?</p>
            <div className="flex items-center gap-3">
              <button
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${
                  vote === true
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                    : vote !== null
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
                }`}
                onClick={() => handleVote(true)}
                disabled={vote !== null}
                aria-label="Mark as helpful"
                title={vote !== null ? 'You have already voted on this question' : 'Mark as helpful'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <button
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${
                  vote === false
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : vote !== null
                      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
                }`}
                onClick={() => handleVote(false)}
                disabled={vote !== null}
                aria-label="Mark as not helpful"
                title={vote !== null ? 'You have already voted on this question' : 'Mark as not helpful'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
              {showThanks && (
                <span className="text-sm text-emerald-600 font-medium animate-[fadeIn_200ms_ease-in]">
                  Thanks for your feedback!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
