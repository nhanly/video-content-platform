import { Injectable } from '@nestjs/common';

import { SearchResponseDto } from '@/search/application/dto/search-response.dto';
import { SearchVideosQuery } from '@/search/application/queries/search-videos.query';
import { VideoSearchService } from '@/search/application/services/video-search.service';

@Injectable()
export class SearchVideosUseCase {
  constructor(private readonly videoSearchService: VideoSearchService) {}

  async execute(query: SearchVideosQuery): Promise<SearchResponseDto> {
    return await this.videoSearchService.searchVideos(query);
  }
}
