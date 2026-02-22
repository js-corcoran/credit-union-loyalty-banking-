'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-12">
      <div
        className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
        role="alert"
      >
        <svg className="w-10 h-10 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-base text-red-700 mb-6">
          Unable to load your account. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 min-h-[48px] transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
