import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CacheService } from '@/shared/interfaces/cache.service.interface';
import { ProcessingStatus } from '@/video/domain/entities/video.entity';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';

@Injectable()
export class StreamingService {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) {}

  async generateHLSManifest(videoId: string, userId?: string): Promise<string> {
    const video = await this.getVideoWithAccessCheck(videoId, userId);

    if (!video.filePaths?.hlsPlaylistUrl) {
      throw new NotFoundException('HLS manifest not available for this video');
    }

    // Generate HLS manifest content
    const qualities = video.qualities || [];
    let manifest = '#EXTM3U\n#EXT-X-VERSION:3\n\n';

    for (const quality of qualities) {
      manifest += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bitrate * 1000},RESOLUTION=${quality.resolution}\n`;
      manifest += `${quality.qualityLabel}.m3u8\n`;
    }

    return manifest;
  }

  async generateDASHManifest(
    videoId: string,
    userId?: string,
  ): Promise<string> {
    const video = await this.getVideoWithAccessCheck(videoId, userId);

    if (!video.filePaths?.dashManifestUrl) {
      throw new NotFoundException('DASH manifest not available for this video');
    }

    // Generate basic DASH manifest
    const qualities = video.qualities || [];
    let manifest = '<?xml version="1.0" encoding="utf-8"?>\n';
    manifest +=
      '<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-live:2011">\n';
    manifest += '  <Period>\n';
    manifest += '    <AdaptationSet mimeType="video/mp4">\n';

    for (const quality of qualities) {
      manifest += `      <Representation id="${quality.qualityLabel}" bandwidth="${quality.bitrate * 1000}" width="${quality.resolution.split('x')[0]}" height="${quality.resolution.split('x')[1]}">\n`;
      manifest += `        <BaseURL>${quality.filePath}</BaseURL>\n`;
      manifest += '      </Representation>\n';
    }

    manifest += '    </AdaptationSet>\n';
    manifest += '  </Period>\n';
    manifest += '</MPD>';

    return manifest;
  }

  async getSegmentUrl(
    videoId: string,
    segment: string,
    userId?: string,
  ): Promise<string> {
    const video = await this.getVideoWithAccessCheck(videoId, userId);

    // Validate segment name to prevent path traversal
    if (!this.isValidSegmentName(segment)) {
      throw new ForbiddenException('Invalid segment name');
    }

    // Generate signed URL for the segment
    const baseUrl =
      video.filePaths?.processedPath || video.filePaths?.originalPath;
    if (!baseUrl) {
      throw new NotFoundException('Video files not available');
    }

    // In a real implementation, you would generate a signed URL from your CDN/S3
    // For now, return a constructed URL
    const segmentUrl = `${baseUrl}/segments/${segment}`;

    return segmentUrl;
  }

  async recordView(
    videoId: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    watchDuration?: number,
  ): Promise<void> {
    const video = await this.getVideoWithAccessCheck(videoId, userId);

    // Record view analytics (this would typically go to a separate analytics service)
    const viewData = {
      videoId,
      userId,
      ipAddress,
      userAgent,
      watchDuration,
      timestamp: new Date(),
    };

    // Cache the view record temporarily before processing
    const viewKey = `view:${videoId}:${userId || ipAddress}:${Date.now()}`;
    await this.cacheService.set(viewKey, JSON.stringify(viewData), 3600);

    // In a real implementation, you would:
    // 1. Queue this for batch processing to avoid hitting the DB for every view
    // 2. Update video view count asynchronously
    // 3. Store in a time-series database for analytics
  }

  private async getVideoWithAccessCheck(
    videoId: string,
    userId?: string,
  ): Promise<any> {
    const video = await this.videoRepository.findById(videoId);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check if user can access this video
    if (!this.canAccessVideo(video, userId)) {
      throw new ForbiddenException('Access denied to this video');
    }

    if (video.status !== ProcessingStatus.READY) {
      throw new NotFoundException('Video is not ready for streaming');
    }

    return video;
  }

  private canAccessVideo(video: any, userId?: string): boolean {
    // Public videos are accessible to everyone
    if (video.visibility === 'PUBLIC') {
      return true;
    }

    // Private videos are only accessible to the owner
    if (video.visibility === 'PRIVATE') {
      return userId === (video.userId?.value || video.userId);
    }

    return false;
  }

  private isValidSegmentName(segment: string): boolean {
    // Only allow alphanumeric characters, hyphens, underscores, and dots
    // Prevent path traversal attacks
    const validSegmentRegex = /^[a-zA-Z0-9._-]+\.(ts|m4s|mp4)$/;
    return validSegmentRegex.test(segment) && !segment.includes('..');
  }
}
