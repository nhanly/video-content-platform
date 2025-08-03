import { Injectable } from '@nestjs/common';

import { CacheService } from '@/cache/cache.service';
import { ElasticsearchService } from '@/elasticsearch/elasticsearch.service';
import {
  SearchResponseDto,
  SearchVideoResultDto,
} from '@/search/application/dto/search-response.dto';
import { SearchVideosQuery } from '@/search/application/queries/search-videos.query';

import { IVideoSearchStrategy } from './video-search-strategy.interface';

@Injectable()
export class ElasticsearchSearchStrategy implements IVideoSearchStrategy {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly cacheService: CacheService,
  ) {}

  async searchVideos(query: SearchVideosQuery): Promise<SearchResponseDto> {
    const startTime = Date.now();

    const cacheKey = this.generateSearchCacheKey(query);

    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult) as SearchResponseDto;
    }

    const searchQuery = this.buildElasticsearchQuery(query);

    const response = await this.elasticsearchService.search(
      query.query,
      searchQuery.filters,
      query.page,
      query.limit,
    );

    const executionTime = Date.now() - startTime;

    const searchResponse: SearchResponseDto = {
      data: response.items.map((item) => this.mapToSearchResult(item)),
      total: response.total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(response.total / query.limit),
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
      'search:elasticsearch',
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

  private buildElasticsearchQuery(query: SearchVideosQuery): { filters: any } {
    const filters: any = {
      visibility: 'PUBLIC',
      status: 'READY',
    };

    if (query.categoryIds && query.categoryIds.length > 0) {
      filters.categoryId = query.categoryIds;
    }

    if (query.tags && query.tags.length > 0) {
      filters.tags = query.tags;
    }

    if (query.userId) {
      filters.userId = query.userId;
    }

    if (query.minDuration || query.maxDuration) {
      filters.duration = {};
      if (query.minDuration) {
        filters.duration.gte = query.minDuration;
      }
      if (query.maxDuration) {
        filters.duration.lte = query.maxDuration;
      }
    }

    if (query.dateFrom || query.dateTo) {
      filters.createdAt = {};
      if (query.dateFrom) {
        filters.dateFrom = query.dateFrom;
      }
      if (query.dateTo) {
        filters.dateTo = query.dateTo;
      }
    }

    return { filters };
  }

  private mapToSearchResult(item: any): SearchVideoResultDto {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      code: item.code,
      status: item.status,
      visibility: item.visibility,
      thumbnailUrl: item.thumbnailUrl,
      previewGifUrl: item.previewGifUrl,
      hlsPlaylistUrl: item.hlsPlaylistUrl,
      dashManifestUrl: item.dashManifestUrl,
      duration: item.duration,
      fileSize: item.fileSize,
      resolution: item.resolution,
      format: item.format,
      bitrate: item.bitrate,
      viewCount: item.viewCount || 0,
      likeCount: item.likeCount || 0,
      commentCount: item.commentCount || 0,
      tags: item.tags || [],
      category: item.category,
      user: item.user,
      qualities: item.qualities || [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      score: item.score || 0,
      highlights: item.highlights,
    };
  }
}
