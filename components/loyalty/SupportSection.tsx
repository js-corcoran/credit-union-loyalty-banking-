'use client'

import Link from 'next/link'
import { Card } from '@/components/shared/Card'

const contactMethods = [
  {
    label: 'Phone',
    description: 'Talk to a loyalty specialist',
    detail: '1-800-555-0123',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: 'Chat',
    description: 'Live chat with support',
    detail: 'Available 8am-8pm',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    description: 'Send us a message',
    detail: 'Response within 24hrs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export function SupportSection() {
  return (
    <section aria-label="Get help">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {contactMethods.map((method) => (
          <Card key={method.label} className="p-4 text-center">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 mb-2">
              {method.icon}
            </span>
            <p className="text-base font-semibold text-gray-900">{method.label}</p>
            <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
            <p className="text-sm text-gray-400 mt-0.5">{method.detail}</p>
          </Card>
        ))}
      </div>
      <Link
        href="/help"
        className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline min-h-[48px] inline-flex items-center"
      >
        Contact Support
        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  )
}
