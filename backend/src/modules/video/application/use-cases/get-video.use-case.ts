import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '@/shared/interfaces/cache.service.interface';
import { VideoResponseDto } from '@/video/application/dto/video-response.dto';
import { GetVideoQuery } from '@/video/application/queries/get-video.query';
import { ProcessingStatus, Video } from '@/video/domain/entities/video.entity';
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

      return parsedVideo;
    }

    // Get from database
    const video = await this.videoRepository.findById(query.videoId);

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const response = this.mapToResponse(video);

    // Cache for 1 hour if video is ready
    if (video.status === ProcessingStatus.READY) {
      await this.cacheService.set(cacheKey, JSON.stringify(response), 3600);
    }

    return response;
  }

  private mapToResponse(video: Video): VideoResponseDto {
    const nowISO = new Date().toISOString();
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      code: video.code,
      status: video.status,
      visibility: video.visibility,
      thumbnailUrl: video.filePaths?.thumbnailUrl,
      hlsPlaylistUrl: video.filePaths?.hlsPlaylistUrl,
      dashManifestUrl: video.filePaths?.dashManifestUrl,
      duration: video.metadata?.duration,
      fileSize: video.metadata?.fileSize,
      resolution: video.metadata?.resolution,
      format: video.metadata?.format,
      bitrate: video.metadata?.bitrate,
      viewCount: video.getViewCount(),
      likeCount: video.getLikeCount(),
      commentCount: video.getCommentCount(),
      tags: [],
      category: video.category
        ? {
            id: video.category.id,
            name: video.category.name,
          }
        : undefined,
      user: {
        id: video.user?.id || video.userId,
        username: video.user?.username || '',
        firstName: video.user?.profile.firstName,
        lastName: video.user?.profile.lastName,
      },
      // qualities: video.videoQualities || [],
      createdAt: video.createdAt?.toISOString() || nowISO,
      updatedAt: video.updatedAt?.toISOString() || nowISO,
    };
  }
}
