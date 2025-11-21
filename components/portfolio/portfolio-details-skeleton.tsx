"use client"

export function PortfolioDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200"></div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-8 bg-gray-200 rounded-full w-20"
          />
        ))}
      </div>
      <div className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-100 p-4 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      <div className="flex justify-center border-t border-gray-200 pt-6">
        <div className="h-12 bg-gray-200 rounded-full w-64"></div>
      </div>
    </div>
  )
}