import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { CacheService } from '@/shared/interfaces/cache.service.interface';
import { VideoUploadedEvent } from '@/video/domain/events/video-upload.event';
import { VideoProcessingWorker } from '@/video/infrastructure/workers/video-processing.worker';

@EventsHandler(VideoUploadedEvent)
export class VideoUploadedHandler implements IEventHandler<VideoUploadedEvent> {
  constructor(
    @Inject('CacheService') private readonly cacheService: CacheService,
    private readonly videoProcessingWorker: VideoProcessingWorker,
  ) {}

  async handle(event: VideoUploadedEvent): Promise<void> {
    console.log(
      `Video uploaded event received: ${event.videoId} by user ${event.userId}`,
    );

    try {
      // Cache video upload session for quick access
      await Promise.resolve(
        this.cacheService.set(
          `video:upload:${event.videoId}`,
          JSON.stringify({
            videoId: event.videoId,
            userId: event.userId,
            status: 'uploaded',
            timestamp: new Date().toISOString(),
          }),
          3600, // 1 hour
        ),
      );

      // Start processing worker if not already running
      // TODO: In production, this would be handled by a separate worker process
      this.videoProcessingWorker.startProcessing().catch((error) => {
        console.error('Error starting video processing worker:', error);
      });

      console.log(`Video upload event processed for video ${event.videoId}`);
    } catch (error) {
      console.error('Error handling video upload event:', error);
    }
  }
}
