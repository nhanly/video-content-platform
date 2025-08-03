import { SearchResponseDto } from '@/search/application/dto/search-response.dto';
import { SearchVideosQuery } from '@/search/application/queries/search-videos.query';

export interface IVideoSearchStrategy {
  searchVideos(query: SearchVideosQuery): Promise<SearchResponseDto>;
}
