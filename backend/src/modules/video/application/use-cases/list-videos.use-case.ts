import { Inject, Injectable } from '@nestjs/common';

import { CacheService } from '@/shared/interfaces/cache.service.interface';
import {
  PaginatedVideoResponse,
  VideoResponseDto,
} from '@/video/application/dto/video-response.dto';
import { ListVideosQuery } from '@/video/application/queries/list-videos.query';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';

import { Video } from '../../domain/entities/video.entity';

interface VideoFilters {
  visibility?: string;
  status?: string;
  categoryId?: string;
  userId?: string;
  OR?: Array<{
    userId?: string;
    visibility?: string;
    status?: string;
  }>;
}

@Injectable()
export class ListVideosUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) {}

  async execute(query: ListVideosQuery): Promise<PaginatedVideoResponse> {
    const cacheKey = this.generateCacheKey(query);

    // Try to get from cache first (only for public listings)
    if (!query.userId && !query.search) {
      const cachedResult = await this.cacheService.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult) as PaginatedVideoResponse;
      }
    }

    // Get from database with filters
    const filters = this.buildFilters(query);
    const sortOptions = this.buildSortOptions(query);

    const result = await this.videoRepository.findManyWithFilters({
      filters,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
      sort: sortOptions,
    });

    const response: PaginatedVideoResponse = {
      data: result.data.map((video) => this.mapToResponse(video)),
      total: result.total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(result.total / query.limit),
    };

    // Cache public results for 5 minutes
    if (!query.userId && !query.search) {
      await this.cacheService.set(cacheKey, JSON.stringify(response), 300);
    }

    return response;
  }

  private generateCacheKey(query: ListVideosQuery): string {
    const keyParts = [
      'videos:list',
      query.page,
      query.limit,
      query.categoryId || 'all',
      query.status || 'all',
      query.visibility || 'all',
      query.sortBy || 'createdAt',
      query.sortOrder || 'desc',
    ];
    return keyParts.join(':');
  }

  private buildFilters(query: ListVideosQuery): VideoFilters {
    const filters: VideoFilters = {};

    // Only show public videos for non-authenticated requests
    if (!query.userId) {
      filters.visibility = 'PUBLIC';
      filters.status = 'READY';
    } else {
      // For authenticated users, show their own videos regardless of status/visibility
      // and public ready videos from others
      filters.OR = [
        { userId: query.userId },
        { visibility: 'PUBLIC', status: 'READY' },
      ];
    }

    // Apply additional filters
    if (query.categoryId) {
      filters.categoryId = query.categoryId;
    }

    if (query.status && query.userId) {
      // Only apply status filter if user is authenticated (can see their own processing videos)
      delete filters.OR;
      filters.userId = query.userId;
      filters.status = query.status;
    }

    if (query.visibility && query.userId) {
      delete filters.OR;
      filters.userId = query.userId;
      filters.visibility = query.visibility;
    }

    return filters;
  }

  private buildSortOptions(
    query: ListVideosQuery,
  ): Record<string, 'asc' | 'desc'> {
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    return {
      [sortField]: sortOrder,
    };
  }

  private mapToResponse(video: Video): VideoResponseDto {
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
      tags: [],
      category: {
        id: video.category.id,
        name: video.category.name,
      },
      // qualities: video.videoQualities.map(
      //   ({ id, label, resolution, bitrate, filePath, fileSize }) => ({
      //     id,
      //     qualityLabel: label,
      //     resolution: resolution,
      //     bitrate: bitrate,
      //     filePath: filePath,
      //     fileSize: fileSize,
      //   }),
      // ),
      createdAt: video.createdAt?.toISOString(),
      updatedAt: video.updatedAt?.toISOString(),
    };
  }
}
