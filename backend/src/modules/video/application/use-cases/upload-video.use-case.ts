import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { UploadVideoCommand } from '@/video/application/commands/upload-video.command';
import { VideoService } from '@/video/application/services/video.service';
import { ProcessingStatus, Video } from '@/video/domain/entities/video.entity';
import { VideoUploadedEvent } from '@/video/domain/events/video-upload.event';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';
import { VideoFilePaths } from '@/video/domain/value-objects/video-filepath.vo';

@Injectable()
export class UploadVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly videoService: VideoService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UploadVideoCommand): Promise<any> {
    this.videoService.validateVideoFile(command.file);

    const videoId = crypto.randomUUID();
    const videoCode = await this.videoService.generateUniqueVideoCode(
      command.title,
    );

    const uploadResult = await this.videoService.uploadVideo(
      command.file,
      `videos/${videoId}/original.${this.videoService.getFileExtension(
        command.file,
      )}`,
    );

    const metadata = this.videoService.extractMetadata(command.file);
    const now = new Date();

    const video = new Video(
      videoId,
      command.title,
      command.description,
      videoCode,
      command.userId,
      command.categoryId,
      metadata,
      ProcessingStatus.UPLOADED,
      new VideoFilePaths({ originalPath: uploadResult.url }),
      command.visibility,
      now,
      now,
    );

    await this.videoRepository.save(video);

    this.videoService.queueProcessingJobs(video);

    await this.eventBus.publish(new VideoUploadedEvent(video.id, video.userId));

    return this.videoService.mapToResponse(video);
  }
}
