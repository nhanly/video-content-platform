export interface VideoSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  uploadedAt: Date;
  status: string;
  visibility: string;
  tags: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    username: string;
    displayName: string;
  };
}

export interface VideoProcessingJob {
  videoId: string;
  type: 'metadata_extraction' | 'thumbnail' | 'preview' | 'transcode';
  priority: number;
  inputPath: string;
  outputPath?: string;
  options?: Record<string, any>;
  retryCount?: number;
  createdAt: Date;
}

export interface VideoMetadataResult {
  duration: number;
  fileSize: number;
  resolution: string;
  format: string;
  bitrate: number;
}

export interface VideoQuality {
  quality: string;
  path: string;
  resolution: string;
  bitrate: number;
}
