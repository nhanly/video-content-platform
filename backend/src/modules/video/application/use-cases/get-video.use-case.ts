import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CacheService } from '@/shared/interfaces/cache.service.interface';
import { VideoResponseDto } from '@/video/application/dto/video-response.dto';
import { GetVideoQuery } from '@/video/application/queries/get-video.query';
import { ProcessingStatus } from '@/video/domain/entities/video.entity';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';

@Injectable()
export class GetVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) {}

  async execute(query: GetVideoQuery): Promise<VideoResponseDto> {
    const cacheKey = `video:${query.videoId}`;

    // Try to get from cache first
    const cachedVideo = await this.cacheService.get(cacheKey);
    if (cachedVideo) {
      const parsedVideo = JSON.parse(cachedVideo) as VideoResponseDto;

      // Check access rights for cached video
      if (!this.canAccessVideo(parsedVideo, query.userId)) {
        throw new ForbiddenException('Access denied to this video');
      }

      return parsedVideo;
    }

    // Get from database
    const video = await this.videoRepository.findById(query.videoId);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check access rights
    if (!this.canAccessVideo(video, query.userId)) {
      throw new ForbiddenException('Access denied to this video');
    }

    const response = this.mapToResponse(video);

    // Cache for 1 hour if video is ready
    if (video.status === ProcessingStatus.READY) {
      await this.cacheService.set(cacheKey, JSON.stringify(response), 3600);
    }

    return response;
  }

  private canAccessVideo(video: any, userId?: string): boolean {
    // Public videos are accessible to everyone
    if (
      video.visibility === 'PUBLIC' &&
      video.status === ProcessingStatus.READY
    ) {
      return true;
    }

    // Private videos are only accessible to the owner
    if (video.visibility === 'PRIVATE') {
      return userId === video.userId || userId === video.user?.id;
    }

    // Videos still processing are only accessible to the owner
    if (video.status !== ProcessingStatus.READY) {
      return userId === video.userId || userId === video.user?.id;
    }

    return false;
  }

  private mapToResponse(video: any): VideoResponseDto {
    const nowISO = new Date().toISOString();
    return {
      id: video.id?.value || video.id,
      title: video.title,
      description: video.description,
      code: video.code,
      status: video.status,
      visibility: video.visibility,
      thumbnailUrl: video.filePaths?.thumbnailUrl || video.thumbnailUrl,
      previewGifUrl: video.filePaths?.previewGifUrl || video.previewGifUrl,
      hlsPlaylistUrl: video.filePaths?.hlsPlaylistUrl || video.hlsPlaylistUrl,
      dashManifestUrl:
        video.filePaths?.dashManifestUrl || video.dashManifestUrl,
      duration: video.metadata?.duration || video.duration,
      fileSize: video.metadata?.fileSize || video.fileSize,
      resolution: video.metadata?.resolution || video.resolution,
      format: video.metadata?.format || video.format,
      bitrate: video.metadata?.bitrate || video.bitrate,
      viewCount: video.viewCount || 0,
      likeCount: video.likeCount || 0,
      commentCount: video.commentCount || 0,
      tags: video.tags || [],
      category: video.category
        ? {
            id: video.category.id,
            name: video.category.name,
          }
        : undefined,
      user: {
        id: video.user.id,
        username: video.user?.username || '',
        firstName: video.user?.firstName,
        lastName: video.user?.lastName,
      },
      qualities: video.qualities || [],
      createdAt: video.createdAt?.toISOString() || nowISO,
      updatedAt: video.updatedAt?.toISOString() || nowISO,
    };
  }
}
