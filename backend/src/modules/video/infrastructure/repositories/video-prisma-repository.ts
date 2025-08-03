import { Injectable } from '@nestjs/common';
import {
  Prisma,
  VideoStatus as PrismaVideoStatus,
  VideoVisibility as PrismaVideoVisibility,
} from '@prisma/client';

import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import {
  ProcessingStatus,
  Video,
  VideoVisibility,
} from '@/video/domain/entities/video.entity';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';
import { VideoFilePaths } from '@/video/domain/value-objects/video-filepath.vo';
import { VideoMetadata } from '@/video/domain/value-objects/video-metadata.vo';

import { Category } from '../../domain/entities/category.entity';
import { VideoQuality } from '../../domain/entities/video-quality.entity';

export type VideoWithAllRelations = Prisma.VideoGetPayload<{
  include: {
    user: true;
    category: true;
    qualities: true;
  };
}>;

export type VideoWithUserRelations = Prisma.VideoGetPayload<{
  include: {
    user: true;
  };
}>;

@Injectable()
export class PrismaVideoRepository implements IVideoRepository {
  private readonly _statusMap: Record<ProcessingStatus, PrismaVideoStatus> = {
    [ProcessingStatus.UPLOADING]: PrismaVideoStatus.UPLOADING,
    [ProcessingStatus.UPLOADED]: PrismaVideoStatus.UPLOADED,
    [ProcessingStatus.PROCESSING]: PrismaVideoStatus.PROCESSING,
    [ProcessingStatus.READY]: PrismaVideoStatus.READY,
    [ProcessingStatus.FAILED]: PrismaVideoStatus.FAILED,
  };
  private readonly _visibilityMap: Record<
    VideoVisibility,
    PrismaVideoVisibility
  > = {
    [VideoVisibility.PUBLIC]: PrismaVideoVisibility.PUBLIC,
    [VideoVisibility.PRIVATE]: PrismaVideoVisibility.PRIVATE,
  };
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        qualities: true,
      },
    });

    return video ? this.mapToDomain(video) : null;
  }

  async findByCode(code: string): Promise<Video | null> {
    const video = await this.prisma.video.findUnique({
      where: { code },
      include: {
        user: true,
        category: true,
        qualities: true,
      },
    });

    return video ? this.mapToDomain(video) : null;
  }

  async save(video: Video): Promise<Video> {
    const data = this.mapToPersistence(video);

    const savedVideo = await this.prisma.video.upsert({
      where: { id: video.id },
      update: data,
      create: data,
      include: {
        user: true,
        category: true,
        qualities: true,
      },
    });

    return this.mapToDomain(savedVideo);
  }

  async create(video: Video): Promise<Video> {
    const data = this.mapToPersistence(video);

    const createdVideo = await this.prisma.video.create({
      data,
      include: {
        user: true,
        category: true,
        qualities: true,
      },
    });

    return this.mapToDomain(createdVideo);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.video.delete({
      where: { id },
    });
  }

  async findManyWithFilters(options: {
    filters: Record<string, any>;
    pagination: { page: number; limit: number };
    sort: Record<string, 'asc' | 'desc'>;
  }): Promise<{ data: Video[]; total: number }> {
    const { filters, pagination, sort } = options;
    const skip = (pagination.page - 1) * pagination.limit;

    // Build Prisma where clause from filters
    const where: Prisma.VideoWhereInput = this.buildPrismaFilters(filters);

    // Execute count and find queries in parallel
    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: sort,
        include: {
          category: true,
          user: true,
          qualities: true,
        },
      }),
      this.prisma.video.count({ where }),
    ]);

    return {
      data: videos.map((video) => this.mapToDomain(video)),
      total,
    };
  }

  private buildPrismaFilters(
    filters: Record<string, any>,
  ): Prisma.VideoWhereInput {
    const where: Prisma.VideoWhereInput = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'OR') {
        where.OR = value.map((filter: Record<string, any>) =>
          this.buildPrismaFilters(filter),
        );
      } else if (key === 'userId') {
        where.userId = value;
      } else if (key === 'categoryId') {
        where.categoryId = value;
      } else if (key === 'status') {
        where.status = value;
      } else if (key === 'visibility') {
        where.visibility = value;
      }
    });

    return where;
  }

  private mapToDomain(video: VideoWithAllRelations): Video {
    return new Video(
      video.id,
      video.title,
      video.description,
      video.code,
      video.userId,
      video.categoryId,
      new VideoMetadata({
        duration: video.duration || 0,
        fileSize: video.fileSize ? Number(video.fileSize) : 0,
        resolution: '',
        format: '',
        bitrate: 0,
      }),
      video.status as ProcessingStatus,
      new VideoFilePaths({
        originalPath: video.originalFilePath,
        processedPath: video.processedFilePath,
        thumbnailUrl: video.thumbnailUrl,
        hlsPlaylistUrl: video.hlsPlaylistUrl,
        dashManifestUrl: video.dashManifestUrl,
      }),
      video.visibility as VideoVisibility,
      video.createdAt,
      video.updatedAt,
      video.category
        ? new Category(
            video.category.id,
            video.category.name,
            video.category.code,
            video.category.description,
            video.category.thumbnailUrl,
            video.category.parentId,
            video.category.sortOrder,
            video.category.isActive,
          )
        : null,
      video.qualities?.map(
        (quality) =>
          new VideoQuality(
            quality.id,
            quality.label,
            quality.resolution,
            quality.bitrate,
            quality.filePath,
            quality.fileSize,
            quality.createdAt,
          ),
      ),
    );
  }

  private mapToPersistence(video: Video): Prisma.VideoCreateInput {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      code: video.code,
      user: { connect: { id: video.userId } },
      category: video.categoryId
        ? { connect: { id: video.categoryId } }
        : undefined,
      duration: video.metadata.duration,
      fileSize: video.metadata.fileSize
        ? BigInt(video.metadata.fileSize)
        : null,
      // resolution: video.metadata.resolution,
      // format: video.metadata.format,
      // bitrate: video.metadata.bitrate,
      status: this.mapStatusToPrisma(video.status),
      visibility: this.mapVisibilityToPrisma(video.visibility),
      originalFilePath: video.filePaths.originalPath,
      processedFilePath: video.filePaths.processedPath,
      thumbnailUrl: video.filePaths.thumbnailUrl,
      hlsPlaylistUrl: video.filePaths.hlsPlaylistUrl,
      dashManifestUrl: video.filePaths.dashManifestUrl,
      updatedAt: video.updatedAt,
    };
  }

  private mapStatusToPrisma(status: ProcessingStatus): PrismaVideoStatus {
    return this._statusMap[status];
  }

  private mapVisibilityToPrisma(
    visibility: VideoVisibility,
  ): PrismaVideoVisibility {
    return this._visibilityMap[visibility];
  }
}
