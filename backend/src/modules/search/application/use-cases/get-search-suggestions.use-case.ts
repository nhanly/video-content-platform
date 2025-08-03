import { Injectable } from '@nestjs/common';

import { SearchSuggestionsResponseDto } from '@/search/application/dto/search-response.dto';
import { SearchSuggestionsQuery } from '@/search/application/queries/search-videos.query';
import { VideoSearchService } from '@/search/application/services/video-search.service';

@Injectable()
export class GetSearchSuggestionsUseCase {
  constructor(private readonly videoSearchService: VideoSearchService) {}

  async execute(
    query: SearchSuggestionsQuery,
  ): Promise<SearchSuggestionsResponseDto> {
    return await this.videoSearchService.getSearchSuggestions(query);
  }
}
