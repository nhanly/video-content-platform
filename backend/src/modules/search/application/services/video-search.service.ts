import { Injectable } from '@nestjs/common';

import { CacheService } from '@/cache/cache.service';
import {
  SearchResponseDto,
  SearchSuggestionsResponseDto,
} from '@/search/application/dto/search-response.dto';
import {
  SearchSuggestionsQuery,
  SearchVideosQuery,
} from '@/search/application/queries/search-videos.query';

import { SearchStrategyFactory } from '../factories/search-strategy.factory';

@Injectable()
export class VideoSearchService {
  constructor(
    private readonly searchStrategyFactory: SearchStrategyFactory,
    private readonly cacheService: CacheService,
  ) {}

  async searchVideos(query: SearchVideosQuery): Promise<SearchResponseDto> {
    const strategy = this.searchStrategyFactory.createSearchStrategy();
    return await strategy.searchVideos(query);
  }

  async getSearchSuggestions(
    query: SearchSuggestionsQuery,
  ): Promise<SearchSuggestionsResponseDto> {
    const cacheKey = `search:suggestions:${query.query}:${query.limit}`;

    // Try to get from cache first
    const cachedSuggestions = await this.cacheService.get(cacheKey);
    if (cachedSuggestions) {
      return JSON.parse(cachedSuggestions) as SearchSuggestionsResponseDto;
    }

    // In a real implementation, you would use Elasticsearch's completion suggester
    // For now, we'll create a simple implementation based on existing video titles
    const suggestions = await this.generateSuggestions(
      query.query,
      query.limit,
    );

    const response: SearchSuggestionsResponseDto = {
      suggestions,
      query: query.query,
    };

    // Cache suggestions for 1 hour
    await this.cacheService.set(cacheKey, JSON.stringify(response), 3600);

    return response;
  }

  private async generateSuggestions(
    query: string,
    limit: number,
  ): Promise<Array<{ text: string; count: number }>> {
    // TODO: use Elasticsearch's completion suggester
    // or maintain a separate suggestions index

    const commonSuggestions = [
      'tutorial',
      'how to',
      'review',
      'cooking',
      'music',
      'gaming',
      'technology',
      'education',
      'entertainment',
      'news',
    ];

    return Promise.resolve(
      commonSuggestions
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, limit)
        .map((text) => ({
          text: text.charAt(0).toUpperCase() + text.slice(1),
          count: Math.floor(Math.random() * 1000) + 1, // Mock count
        })),
    );
  }
}
