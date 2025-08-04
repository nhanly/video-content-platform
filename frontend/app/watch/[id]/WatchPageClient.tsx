"use client";

import { useEffect, useState } from "react";
import { useVideoStore } from "@/shared/model/store";
import VideoPlayer from "@/features/video-player/VideoPlayer";
import VideoCard from "@/entities/video/ui/VideoCard";
import {
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
import { Video } from "@/shared/model/type";
import { formatDate } from "@/shared/lib/date";

interface WatchPageClientProps {
  video: Video;
  relatedVideos: Video[];
}

export default function WatchPageClient({
  video,
  relatedVideos,
}: WatchPageClientProps) {
  const { setCurrentVideo } = useVideoStore();
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (video) {
      setCurrentVideo(video);
    }
  }, [video, setCurrentVideo]);

  const formatViewCount = (count?: number) => {
    if (!count) return "0 views";
    if (count < 1000) return `${count} views`;
    if (count < 1000000) return `${Math.floor(count / 1000)}K views`;
    return `${Math.floor(count / 1000000)}M views`;
  };

  const getVideoSrc = () => {
    return video.hlsPlaylistUrl || video.dashManifestUrl || "";
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1">
          <ErrorBoundary fallback={<VideoErrorFallback />}>
            <VideoPlayer
              src={getVideoSrc()}
              poster={video.thumbnailUrl}
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
                  src={
                    video.user?.firstName
                      ? `/placeholder-user.jpg`
                      : "/placeholder.svg"
                  }
                  alt={video.user?.username || "Unknown user"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">
                      {video.user?.username || "Unknown user"}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViewCount(video.viewCount)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{video.likeCount || 0}</span>
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

            {/* Video Metadata */}
            {video.category && (
              <div className="mb-4">
                <span className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {video.category.name}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-900 rounded-lg p-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-white font-medium mb-2 hover:text-red-400 transition-colors"
              >
                {showDescription ? "Show Less" : "Show More"}
              </button>
              <p
                className={`text-gray-300 whitespace-pre-wrap ${
                  showDescription ? "" : "line-clamp-3"
                }`}
              >
                {video.description}
              </p>
              {video.duration && (
                <div className="mt-2 text-sm text-gray-400">
                  Duration: {Math.floor(video.duration / 60)}:
                  {(video.duration % 60).toFixed(0).padStart(2, "0")}
                </div>
              )}
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
              {relatedVideos.map((relatedVideo) => (
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
