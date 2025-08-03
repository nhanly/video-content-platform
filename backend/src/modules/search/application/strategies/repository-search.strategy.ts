import { Inject, Injectable } from '@nestjs/common';

import { CacheService } from '@/cache/cache.service';
import {
  SearchResponseDto,
  SearchVideoResultDto,
} from '@/search/application/dto/search-response.dto';
import { SearchVideosQuery } from '@/search/application/queries/search-videos.query';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';

import { IVideoSearchStrategy } from './video-search-strategy.interface';

@Injectable()
export class RepositorySearchStrategy implements IVideoSearchStrategy {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly cacheService: CacheService,
  ) {}

  async searchVideos(query: SearchVideosQuery): Promise<SearchResponseDto> {
    const startTime = Date.now();

    const cacheKey = this.generateSearchCacheKey(query);

    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult) as SearchResponseDto;
    }

    const filters = this.buildRepositoryFilters(query);
    const sort = this.buildSortOptions(query);

    const { data: videos, total } =
      await this.videoRepository.findManyWithFilters({
        filters,
        pagination: { page: query.page, limit: query.limit },
        sort,
      });

    const executionTime = Date.now() - startTime;

    const searchResponse: SearchResponseDto = {
      data: videos.map((video) => this.mapToSearchResult(video)),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      query: query.query,
      executionTime,
      filters: {
        categoryIds: query.categoryIds,
        tags: query.tags,
        userId: query.userId,
        minDuration: query.minDuration,
        maxDuration: query.maxDuration,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      },
    };

    await this.cacheService.set(cacheKey, JSON.stringify(searchResponse), 300);

    return searchResponse;
  }

  private generateSearchCacheKey(query: SearchVideosQuery): string {
    const keyParts = [
      'search:repository',
      query.query,
      query.page,
      query.limit,
      query.categoryIds?.join(',') || 'all',
      query.tags?.join(',') || 'all',
      query.userId || 'all',
      query.sortBy || 'relevance',
      query.sortOrder || 'desc',
      query.minDuration || 'all',
      query.maxDuration || 'all',
      query.dateFrom || 'all',
      query.dateTo || 'all',
    ];
    return keyParts.join(':');
  }

  private buildRepositoryFilters(
    query: SearchVideosQuery,
  ): Record<string, any> {
    const filters: Record<string, any> = {
      visibility: 'PUBLIC',
      status: 'READY',
    };

    if (query.query) {
      filters.OR = [
        { title: { contains: query.query, mode: 'insensitive' } },
        { description: { contains: query.query, mode: 'insensitive' } },
      ];
    }

    if (query.categoryIds && query.categoryIds.length > 0) {
      filters.categoryId = { in: query.categoryIds };
    }

    if (query.userId) {
      filters.userId = query.userId;
    }

    return filters;
  }

  private buildSortOptions(
    query: SearchVideosQuery,
  ): Record<string, 'asc' | 'desc'> {
    const sortOrder = query.sortOrder || 'desc';

    switch (query.sortBy) {
      case 'title':
        return { title: sortOrder };
      case 'createdAt':
        return { createdAt: sortOrder };
      case 'duration':
        return { duration: sortOrder };
      default:
        return { createdAt: sortOrder };
    }
  }

  private mapToSearchResult(video: any): SearchVideoResultDto {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      code: video.code,
      status: video.status,
      visibility: video.visibility,
      thumbnailUrl: video.filePaths?.thumbnailUrl || null,
      previewGifUrl: null,
      hlsPlaylistUrl: video.filePaths?.hlsPlaylistUrl || null,
      dashManifestUrl: video.filePaths?.dashManifestUrl || null,
      duration: video.metadata?.duration || 0,
      fileSize: video.metadata?.fileSize || 0,
      resolution: video.metadata?.resolution || '',
      format: video.metadata?.format || '',
      bitrate: video.metadata?.bitrate || 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      tags: [],
      category: video.category,
      user: video.user || null,
      qualities: video.qualities || [],
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      score: 0,
      highlights: null,
    };
  }
}
