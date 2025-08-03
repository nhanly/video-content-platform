"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Eye, Clock } from "lucide-react";
import { VideoErrorFallback } from "@/app/shared/ui/components/ErrorBoundary";
import { Video } from "@/shared/model/type";

interface VideoCardProps {
  video: Video;
  className?: string;
}

export default function VideoCard({ video, className = "" }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (imageError) {
    return <VideoErrorFallback onRetry={() => setImageError(false)} />;
  }

  return (
    <Link href={`/watch/${video.id}`} className={`block group ${className}`}>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>

          {/* Play Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-3">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-3 space-y-2">
          <h3 className="text-white font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{video.viewCount} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{video.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
