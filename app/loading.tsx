export default function Loading() {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading">
        <div className="bg-gray-100 rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div>
          <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
