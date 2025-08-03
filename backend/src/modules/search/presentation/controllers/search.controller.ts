import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  SearchResponseDto,
  SearchSuggestionsResponseDto,
} from '@/search/application/dto/search-response.dto';
import { SearchVideosDto } from '@/search/application/dto/search-videos.dto';
import {
  SearchSuggestionsQuery,
  SearchVideosQuery,
} from '@/search/application/queries/search-videos.query';
import { GetSearchSuggestionsUseCase } from '@/search/application/use-cases/get-search-suggestions.use-case';
import { SearchVideosUseCase } from '@/search/application/use-cases/search-videos.use-case';

@Controller('search')
@ApiTags('Search')
export class SearchController {
  constructor(
    private readonly searchVideosUseCase: SearchVideosUseCase,
    private readonly getSearchSuggestionsUseCase: GetSearchSuggestionsUseCase,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Search videos with full-text search and filters' })
  @ApiQuery({
    name: 'query',
    description: 'Search query',
    example: 'cooking tutorial',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'categoryIds',
    required: false,
    type: [String],
    description: 'Filter by category IDs',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: [String],
    description: 'Filter by tags',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'minDuration',
    required: false,
    type: Number,
    description: 'Minimum duration in seconds',
  })
  @ApiQuery({
    name: 'maxDuration',
    required: false,
    type: Number,
    description: 'Maximum duration in seconds',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Date range from (ISO string)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'Date range to (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results returned successfully',
    type: SearchResponseDto,
  })
  async searchVideos(
    @Query() searchDto: SearchVideosDto,
  ): Promise<SearchResponseDto> {
    const query = new SearchVideosQuery(
      searchDto.query,
      searchDto.page,
      searchDto.limit,
      searchDto.categoryIds,
      searchDto.tags,
      searchDto.userId,
      searchDto.sortBy,
      searchDto.sortOrder,
      searchDto.minDuration,
      searchDto.maxDuration,
      searchDto.dateFrom,
      searchDto.dateTo,
    );

    return await this.searchVideosUseCase.execute(query);
  }

  @Get('suggestions/:query')
  @ApiOperation({ summary: 'Get search suggestions based on input' })
  @ApiParam({ name: 'query', description: 'Partial search query' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of suggestions',
  })
  @ApiResponse({
    status: 200,
    description: 'Search suggestions returned successfully',
    type: SearchSuggestionsResponseDto,
  })
  @UseInterceptors(CacheInterceptor)
  async getSearchSuggestions(
    @Param('query') queryText: string,
    @Query('limit') limit?: number,
  ): Promise<SearchSuggestionsResponseDto> {
    const query = new SearchSuggestionsQuery(queryText, limit || 10);
    return await this.getSearchSuggestionsUseCase.execute(query);
  }
}
