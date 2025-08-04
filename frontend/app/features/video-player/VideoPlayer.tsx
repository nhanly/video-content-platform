"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { useVideoStore } from "@/app/shared/model/store";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  className = "",
}: Readonly<VideoPlayerProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isDragging] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    isFullscreen,
    quality,
    setIsPlaying,
    setVolume,
    setCurrentTime,
    setDuration,
    setIsFullscreen,
    setQuality,
  } = useVideoStore();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Initialize Video.js player
    const player = videojs(videoElement, {
      controls: false, // We use our custom controls
      preload: 'metadata',
      fluid: true,
      responsive: true,
      sources: [{ src, type: 'video/mp4' }],
      poster,
    });

    playerRef.current = player;

    const handleLoadedMetadata = () => {
      setDuration(player.duration() || 0);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(player.currentTime() || 0);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    player.on('loadedmetadata', handleLoadedMetadata);
    player.on('timeupdate', handleTimeUpdate);
    player.on('play', handlePlay);
    player.on('pause', handlePause);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, isDragging, setCurrentTime, setDuration, setIsPlaying]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const player = playerRef.current;
    if (!player) return;

    player.volume(newVolume);
    setVolume(newVolume);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = playerRef.current;
    const progress = progressRef.current;
    if (!player || !progress) return;

    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    player.currentTime(newTime);
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipTime = (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = player.currentTime() || 0;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    player.currentTime(newTime);
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="video-js vjs-default-skin w-full h-full"
        onClick={togglePlay}
        data-setup="{}"
      />

      {/* Custom Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
            >
              <Play className="w-12 h-12 text-white fill-white ml-1" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-500 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => skipTime(-10)}
                className="hover:text-red-400 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="hover:text-red-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 fill-white" />
                )}
              </button>

              <button
                onClick={() => skipTime(10)}
                className="hover:text-red-400 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                  className="hover:text-red-400 transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) =>
                    handleVolumeChange(Number.parseFloat(e.target.value))
                  }
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none slider"
                />
              </div>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="hover:text-red-400 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg p-2 min-w-24">
                    {["auto", "1080p", "720p", "480p"].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          setShowQualityMenu(false);
                        }}
                        className={`block w-full text-left px-3 py-1 rounded hover:bg-white/20 transition-colors ${
                          quality === q ? "text-red-400" : ""
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="hover:text-red-400 transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
