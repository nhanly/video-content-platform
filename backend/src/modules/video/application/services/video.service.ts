import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Service } from '@/aws/s3.service';
import { QueueService } from '@/queue/queue.service';
import { convertToUrlFriendlyString } from '@/shared/utils/string.util';
import { Video } from '@/video/domain/entities/video.entity';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';
import { VideoMetadata } from '@/video/domain/value-objects/video-metadata.vo';

@Injectable()
export class VideoService {
  private readonly allowedMimeTypes: string;
  private readonly maxSize: number;
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly queueService: QueueService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.allowedMimeTypes = this.configService.get<string>(
      'app.video.allowedMimeTypes',
    );
    this.maxSize = this.configService.get<number>('app.video.maxSize');
  }

  validateVideoFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid video format');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('File size too large');
    }
  }

  async generateUniqueVideoCode(title: string): Promise<string> {
    const baseSlug = convertToUrlFriendlyString(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.videoRepository.findByCode(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async uploadVideo(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ url: string }> {
    return await this.s3Service.uploadFile(file.buffer, key, file.mimetype);
  }

  extractMetadata(file: Express.Multer.File): VideoMetadata {
    // TODO: Use ffprobe to extract metadata.
    return new VideoMetadata({
      duration: 0,
      fileSize: file.size,
      resolution: '0x0',
      format: file.mimetype,
      bitrate: 0,
    });
  }

  queueProcessingJobs(video: Video): void {
    const jobs = [
      {
        type: 'metadata_extraction',
        priority: 1,
        data: { videoId: video.id },
      },
      {
        type: 'thumbnail',
        priority: 2,
        data: { videoId: video.id },
      },
      {
        type: 'transcode',
        priority: 3,
        data: { videoId: video.id },
      },
    ];

    for (const job of jobs) {
      this.queueService.addJob(job.type, JSON.stringify(job.data), {
        priority: job.priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      });
    }
  }

  mapToResponse(video: Video): any {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      code: video.code,
      status: video.status,
      visibility: video.visibility,
      thumbnailUrl: video.filePaths.thumbnailUrl,
      duration: video.metadata.duration,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
    };
  }

  getFileExtension(file: Express.Multer.File): string {
    return file.originalname.split('.').pop();
  }
}
