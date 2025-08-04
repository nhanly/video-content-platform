export interface Video {
  id: string;
  title: string;
  description: string;
  code: string;
  status: string;
  visibility: string;
  thumbnailUrl?: string;
  previewGifUrl?: string;
  hlsPlaylistUrl?: string;
  dashManifestUrl?: string;
  duration?: number;
  fileSize?: number | bigint;
  resolution?: string;
  format?: string;
  bitrate?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  tags: string[];
  category?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  qualities?: Array<{
    qualityLabel: string;
    resolution: string;
    bitrate: number;
    filePath: string;
    fileSize: number | bigint;
  }>;
  createdAt: string;
  updatedAt: string;
  score?: number;
  highlights?: {
    title?: string[];
    description?: string[];
    tags?: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface SearchVideoResponse {
  data: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
  filters?: {
    categoryIds?: string[];
    tags?: string[];
    userId?: string;
    minDuration?: number;
    maxDuration?: number;
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface CategoryResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query: string;
}
