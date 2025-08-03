import { ApiProperty } from '@nestjs/swagger';

export class VideoResponseDto {
  @ApiProperty({ description: 'Video ID' })
  id: string;

  @ApiProperty({ description: 'Video title' })
  title: string;

  @ApiProperty({ description: 'Video description' })
  description: string;

  @ApiProperty({ description: 'Video code' })
  code: string;

  @ApiProperty({ description: 'Processing status' })
  status: string;

  @ApiProperty({ description: 'Video visibility' })
  visibility: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Preview GIF URL', required: false })
  previewGifUrl?: string;

  @ApiProperty({ description: 'HLS playlist URL', required: false })
  hlsPlaylistUrl?: string;

  @ApiProperty({ description: 'DASH manifest URL', required: false })
  dashManifestUrl?: string;

  @ApiProperty({ description: 'Video duration in seconds', required: false })
  duration?: number;

  @ApiProperty({ description: 'File size in bytes', required: false })
  fileSize?: number | bigint;

  @ApiProperty({ description: 'Video resolution', required: false })
  resolution?: string;

  @ApiProperty({ description: 'Video format', required: false })
  format?: string;

  @ApiProperty({ description: 'Video bitrate', required: false })
  bitrate?: number;

  @ApiProperty({ description: 'View count', required: false })
  viewCount?: number;

  @ApiProperty({ description: 'Like count', required: false })
  likeCount?: number;

  @ApiProperty({ description: 'Comment count', required: false })
  commentCount?: number;

  @ApiProperty({ description: 'Video tags', type: [String] })
  tags: string[];

  @ApiProperty({ description: 'Video category', required: false })
  category?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Video user', required: false })
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiProperty({ description: 'Available video qualities', type: [Object] })
  qualities?: Array<{
    qualityLabel: string;
    resolution: string;
    bitrate: number;
    filePath: string;
    fileSize: number | bigint;
  }>;

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: string;
}

export class PaginatedVideoResponse {
  @ApiProperty({ description: 'List of videos', type: [VideoResponseDto] })
  data: VideoResponseDto[];

  @ApiProperty({ description: 'Total number of videos' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
