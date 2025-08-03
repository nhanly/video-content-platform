import { create } from "zustand"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  uploadedAt: string
  channel: {
    name: string
    avatar: string
    verified: boolean
  }
  videoUrl: string
  isLive?: boolean
}

interface Category {
  id: string
  name: string
  thumbnail: string
  color: string
}

interface VideoStore {
  currentVideo: Video | null
  videos: Video[]
  categories: Category[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  isFullscreen: boolean
  quality: string
  setCurrentVideo: (video: Video) => void
  setVideos: (videos: Video[]) => void
  setCategories: (categories: Category[]) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setIsFullscreen: (fullscreen: boolean) => void
  setQuality: (quality: string) => void
}

export const useVideoStore = create<VideoStore>((set) => ({
  currentVideo: null,
  videos: [],
  categories: [],
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  isFullscreen: false,
  quality: "auto",
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setVideos: (videos) => set({ videos }),
  setCategories: (categories) => set({ categories }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setQuality: (quality) => set({ quality }),
}))
