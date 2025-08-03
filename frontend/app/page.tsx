import VideoCard from "@/app/entities/video/ui/VideoCard";
import { ErrorBoundary } from "@/app/shared/ui/components/ErrorBoundary";
import { fetchCategories, fetchVideos } from "./shared/api/api";

export default async function HomePage() {
  const [videos, categories] = await Promise.all([
    fetchVideos(),
    fetchCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6">
        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No Categories available</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-32 h-32 relative"
                >
                  <div className="w-full h-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                      src={category.thumbnailUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-2 w-full">
                        <span className="text-white text-sm font-medium block text-center">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Videos Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">New Videos</h2>
            <button className="text-gray-400 hover:text-white font-medium text-sm">
              View All
            </button>
          </div>

          <ErrorBoundary>
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No videos available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
