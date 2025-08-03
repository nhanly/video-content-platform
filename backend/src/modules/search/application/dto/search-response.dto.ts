import { ApiProperty } from '@nestjs/swagger';

import { VideoResponseDto } from '@/video/application/dto/video-response.dto';

export class SearchVideoResultDto extends VideoResponseDto {
  @ApiProperty({ description: 'Search relevance score' })
  score: number;

  @ApiProperty({ description: 'Highlighted search matches', required: false })
  highlights?: {
    title?: string[];
    description?: string[];
    tags?: string[];
  };
}

export class SearchResponseDto {
  @ApiProperty({ description: 'Search results', type: [SearchVideoResultDto] })
  data: SearchVideoResultDto[];

  @ApiProperty({ description: 'Total number of results' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Search query' })
  query: string;

  @ApiProperty({ description: 'Search execution time in ms' })
  executionTime: number;

  @ApiProperty({ description: 'Applied filters', required: false })
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

export class SearchSuggestionDto {
  @ApiProperty({ description: 'Suggested search term' })
  text: string;

  @ApiProperty({ description: 'Number of results for this suggestion' })
  count: number;
}

export class SearchSuggestionsResponseDto {
  @ApiProperty({
    description: 'Search suggestions',
    type: [SearchSuggestionDto],
  })
  suggestions: SearchSuggestionDto[];

  @ApiProperty({ description: 'Original query' })
  query: string;
}
