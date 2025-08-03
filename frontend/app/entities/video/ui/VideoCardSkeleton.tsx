export function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded-lg aspect-video mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}