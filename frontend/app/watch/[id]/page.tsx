"use client";

import { useParams } from "next/navigation";
import { useVideos } from "@/app/shared/api/api";
import { useVideoStore } from "@/app/shared/model/store";
import VideoPlayer from "@/app/ui/VideoPlayer";
import VideoCard from "@/app/entities/video/ui/VideoCard";
import { VideoPlayerSkeleton } from "@/app/ui/VideoPlayerSkeleton";
import { VideoCardSkeleton } from "@/app/entities/video/ui/VideoCardSkeleton";
import {@/app/shared/ui/components/ErrorBoundary
  ErrorBoundary,
  VideoErrorFallback,
} from "@/shared/ui/components/ErrorBoundary";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Plus,
  Flag,
  Eye,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const params = useParams();
  const videoId = params?.id as string | undefined;
  const { data: videos, isLoading } = useVideos({ enabled: !!videoId });
  const { setCurrentVideo } = useVideoStore();
  const [showDescription, setShowDescription] = useState(false);

  const video = videoId ? videos?.find((v) => v.id === videoId) : undefined;
  const relatedVideos = videoId
    ? videos?.filter((v) => v.id !== videoId).slice(0, 10)
    : undefined;

  useEffect(() => {
    if (video) {
      setCurrentVideo(video);
    }
  }, [video, setCurrentVideo]);

  if (isLoading || !video) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          <div className="flex-1">
            <VideoPlayerSkeleton />
            <div className="mt-4 space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="w-full lg:w-96 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <VideoCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <VideoErrorFallback />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1">
          <ErrorBoundary fallback={<VideoErrorFallback />}>
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full aspect-video rounded-lg overflow-hidden"
            />
          </ErrorBoundary>

          {/* Video Info */}
          <div className="mt-6">
            <h1 className="text-white text-2xl font-bold mb-4">
              {video.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={video.channel.avatar || "/placeholder.svg"}
                  alt={video.channel.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">
                      {video.channel.name}
                    </h3>
                    {video.channel.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900 rounded-lg p-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-white font-medium mb-2 hover:text-red-400 transition-colors"
              >
                {showDescription ? "Show Less" : "Show More"}
              </button>
              <p
                className={`text-gray-300 ${
                  showDescription ? "" : "line-clamp-3"
                }`}
              >
                {video.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="w-full lg:w-96">
          <h3 className="text-white text-lg font-semibold mb-4">
            Related Videos
          </h3>
          <div className="space-y-4">
            <ErrorBoundary>
              {relatedVideos?.map((relatedVideo) => (
                <div key={relatedVideo.id} className="flex space-x-3">
                  <div className="flex-shrink-0 w-40">
                    <VideoCard video={relatedVideo} />
                  </div>
                </div>
              ))}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
