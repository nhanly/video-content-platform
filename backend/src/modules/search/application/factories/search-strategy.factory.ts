import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheService } from '@/cache/cache.service';
import { ElasticsearchService } from '@/elasticsearch/elasticsearch.service';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';

import { ElasticsearchSearchStrategy } from '../strategies/elasticsearch-search.strategy';
import { RepositorySearchStrategy } from '../strategies/repository-search.strategy';
import { IVideoSearchStrategy } from '../strategies/video-search-strategy.interface';

@Injectable()
export class SearchStrategyFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly cacheService: CacheService,
  ) {}

  createSearchStrategy(): IVideoSearchStrategy {
    const useElasticsearch = this.configService.get<boolean>(
      'elasticsearch.useElasticsearch',
      false,
    );

    if (useElasticsearch) {
      return new ElasticsearchSearchStrategy(
        this.elasticsearchService,
        this.cacheService,
      );
    }

    return new RepositorySearchStrategy(
      this.videoRepository,
      this.cacheService,
    );
  }
}
