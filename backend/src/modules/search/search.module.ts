import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CacheService } from '@/cache/cache.service';
import { ElasticsearchService } from '@/elasticsearch/elasticsearch.service';
import { VideoModule } from '@/video/video.module';

import { SearchStrategyFactory } from './application/factories/search-strategy.factory';
import { VideoSearchService } from './application/services/video-search.service';
import { ElasticsearchSearchStrategy } from './application/strategies/elasticsearch-search.strategy';
import { RepositorySearchStrategy } from './application/strategies/repository-search.strategy';
import { GetSearchSuggestionsUseCase } from './application/use-cases/get-search-suggestions.use-case';
import { SearchVideosUseCase } from './application/use-cases/search-videos.use-case';
import { SearchController } from './presentation/controllers/search.controller';

@Module({
  imports: [ConfigModule, VideoModule],
  controllers: [SearchController],
  providers: [
    SearchVideosUseCase,
    GetSearchSuggestionsUseCase,
    VideoSearchService,
    SearchStrategyFactory,
    ElasticsearchSearchStrategy,
    RepositorySearchStrategy,
    ElasticsearchService,
    CacheService,
  ],
  exports: [VideoSearchService],
})
export class SearchModule {}
