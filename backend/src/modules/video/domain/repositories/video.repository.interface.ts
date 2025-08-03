import { Video } from '@/video/domain/entities/video.entity';

export interface IVideoRepository {
  findById(id: string): Promise<Video | null>;
  findByCode(code: string): Promise<Video | null>;
  save(video: Video): Promise<Video>;
  create(video: Video): Promise<Video>;
  delete(id: string): Promise<void>;
  findManyWithFilters(options: {
    filters: Record<string, any>;
    pagination: { page: number; limit: number };
    sort: Record<string, 'asc' | 'desc'>;
  }): Promise<{ data: Video[]; total: number }>;
}
