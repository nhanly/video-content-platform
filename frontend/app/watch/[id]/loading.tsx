import { VideoPlayerSkeleton } from "@/features/video-player/VideoPlayerSkeleton";
import { VideoCardSkeleton } from "@/entities/video/ui/VideoCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="flex-1">
          <VideoPlayerSkeleton />
          <div className="mt-4 space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-16 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full lg:w-96 space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <VideoCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}