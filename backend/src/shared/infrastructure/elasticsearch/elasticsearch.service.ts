import { Client } from '@elastic/elasticsearch';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Video } from '@/modules/video/domain/entities/video.entity';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Client;
  private readonly indexName: string;

  constructor(private readonly configService: ConfigService) {
    this.indexName =
      this.configService.get('elasticsearch.index') ||
      this.configService.get('ELASTICSEARCH_INDEX') ||
      'videos';
    const node =
      this.configService.get('elasticsearch.node') ||
      this.configService.get('ELASTICSEARCH_NODE') ||
      'http://localhost:9200';

    this.client = new Client({
      node,
      auth: {
        username:
          this.configService.get('elasticsearch.username') ||
          this.configService.get('ELASTICSEARCH_USERNAME'),
        password:
          this.configService.get('elasticsearch.password') ||
          this.configService.get('ELASTICSEARCH_PASSWORD'),
      },
    });
  }

  async onModuleInit() {
    try {
      await this.createIndexIfNotExists();
    } catch (error) {
      console.warn(
        'Elasticsearch connection failed. Continuing without search functionality:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  private async createIndexIfNotExists() {
    const exists = await this.client.indices.exists({ index: this.indexName });

    if (exists) return;

    await this.client.indices.create({
      index: this.indexName,
      settings: {
        number_of_shards: 3,
        number_of_replicas: 1,
        analysis: {
          analyzer: {
            video_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'stop', 'stemmer', 'synonym_filter'],
            },
          },
          filter: {
            synonym_filter: {
              type: 'synonym',
              synonyms: [
                'video,clip,movie,film',
                'tutorial,guide,howto',
                'music,song,audio',
              ],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'video_analyzer',
            fields: {
              keyword: { type: 'keyword' },
              suggest: {
                type: 'completion',
                analyzer: 'simple',
              },
            },
          },
          description: {
            type: 'text',
            analyzer: 'video_analyzer',
          },
          tags: {
            type: 'keyword',
            fields: {
              text: { type: 'text', analyzer: 'video_analyzer' },
            },
          },
          category: {
            type: 'nested',
            properties: {
              id: { type: 'keyword' },
              name: { type: 'keyword' },
              slug: { type: 'keyword' },
            },
          },
          user: {
            type: 'nested',
            properties: {
              id: { type: 'keyword' },
              username: { type: 'keyword' },
              displayName: { type: 'text' },
            },
          },
          duration: { type: 'integer' },
          createdAt: { type: 'date' },
          status: { type: 'keyword' },
          visibility: { type: 'keyword' },
        },
      },
    });
  }

  async indexVideo(video: Video): Promise<void> {
    await this.client.index({
      index: this.indexName,
      id: video.id,
      document: {
        id: video.id,
        title: video.title,
        description: video.description,
        // tags: video.tags,
        category: {
          id: video.categoryId,
          // name: video.category?.name,
          // slug: video.category?.slug,
        },
        user: {
          id: video.userId,
          // username: video.user?.username,
          // displayName: video.user?.displayName,
        },
        duration: video.metadata?.duration,
        createdAt: video.createdAt,
        status: video.status,
        visibility: video.visibility,
      },
    });
  }

  async updateVideo(video: any): Promise<void> {
    await this.client.update({
      index: this.indexName,
      id: video.id,
      doc: {
        title: video.title,
        description: video.description,
        tags: video.tags,
        category: {
          id: video.categoryId,
          name: video.category?.name,
          slug: video.category?.slug,
        },
        user: {
          id: video.userId,
          username: video.user?.username,
          displayName: video.user?.displayName,
        },
        duration: video.metadata?.duration,
        status: video.status,
        visibility: video.visibility,
      },
    });
  }

  async deleteVideo(videoId: string): Promise<void> {
    await this.client.delete({
      index: this.indexName,
      id: videoId,
    });
  }

  async search(
    query: string,
    filters?: any,
    page = 1,
    limit = 20,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    const from = (page - 1) * limit;

    const body: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'description', 'tags.text'],
                type: 'best_fields',
              },
            },
          ],
          filter: [],
        },
      },
      from,
      size: limit,
      sort: [{ _score: 'desc' }, { createdAt: 'desc' }],
    };

    // Apply filters
    if (filters) {
      if (filters.categoryId) {
        body.query.bool.filter.push({
          term: { 'category.id': filters.categoryId },
        });
      }

      if (filters.userId) {
        body.query.bool.filter.push({ term: { 'user.id': filters.userId } });
      }

      if (filters.tags && filters.tags.length > 0) {
        body.query.bool.filter.push({ terms: { 'tags.text': filters.tags } });
      }

      if (filters.visibility) {
        body.query.bool.filter.push({
          term: { visibility: filters.visibility },
        });
      }

      if (filters.status) {
        body.query.bool.filter.push({ term: { status: filters.status } });
      }

      if (filters.dateFrom || filters.dateTo) {
        const rangeQuery: any = {};
        if (filters.dateFrom) rangeQuery.gte = filters.dateFrom;
        if (filters.dateTo) rangeQuery.lte = filters.dateTo;
        body.query.bool.filter.push({ range: { createdAt: rangeQuery } });
      }
    }

    const result = await this.client.search({
      index: this.indexName,
      ...body,
    });

    const total =
      typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total?.value || 0;

    return {
      items: result.hits.hits.map((hit) => ({
        id: hit._id,
        ...((hit._source as Record<string, unknown>) || {}),
        score: hit._score,
      })),
      total,
      page,
      limit,
    };
  }
}
