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

  const formatViewCount = (count?: number) => {
    if (!count) return "0";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${Math.floor(count / 1000)}K`;
    return `${Math.floor(count / 1000000)}M`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return dateString;
    }
  };

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
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toFixed(0).padStart(2, '0')}
            </div>
          )}

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
              <span>{formatViewCount(video.viewCount)} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
