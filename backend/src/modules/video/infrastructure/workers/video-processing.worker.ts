import { Inject, Injectable } from '@nestjs/common';

import { QueueService } from '@/shared/infrastructure/queue/queue.service';
import { VideoUploadingService } from '@/video/application/services/video-uploading.service';
import { ProcessingStatus } from '@/video/domain/entities/video.entity';
import { IVideoRepository } from '@/video/domain/repositories/video.repository.interface';
import { VideoFilePaths } from '@/video/domain/value-objects/video-filepath.vo';
import { VideoMetadata } from '@/video/domain/value-objects/video-metadata.vo';

export interface VideoProcessingJobData {
  videoId: string;
  jobType: 'metadata_extraction' | 'thumbnail' | 'preview' | 'transcode';
  inputPath: string;
  outputBasePath: string;
}

@Injectable()
export class VideoProcessingWorker {
  private isProcessing = false;
  private readonly QUEUE_NAME = 'video_processing';

  constructor(
    private readonly queueService: QueueService,
    private readonly videoUploadingService: VideoUploadingService,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  /**
   * Start processing jobs from the queue
   */
  async startProcessing(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    console.log('Video processing worker started');

    while (this.isProcessing) {
      try {
        const job = this.queueService.getNextJob(this.QUEUE_NAME);

        if (!job) {
          // No jobs available, wait and try again
          await this.sleep(5000); // Wait 5 seconds
          continue;
        }

        console.log(`Processing job: ${job.id} (${job.type})`);
        await this.processJob(job.data as VideoProcessingJobData);
        this.queueService.completeJob(this.QUEUE_NAME, job.id);
      } catch (error) {
        console.error('Error processing job:', error);
        // In real implementation, would retry or mark as failed
      }
    }
  }

  /**
   * Stop processing jobs
   */
  stopProcessing(): void {
    this.isProcessing = false;
    console.log('Video processing worker stopped');
  }

  /**
   * Process individual job based on job type
   */
  private async processJob(jobData: VideoProcessingJobData): Promise<void> {
    const { videoId, jobType, inputPath, outputBasePath } = jobData;

    switch (jobType) {
      case 'metadata_extraction':
        await this.processMetadataExtraction(videoId, inputPath);
        break;
      case 'thumbnail':
        await this.processThumbnailGeneration(
          videoId,
          inputPath,
          outputBasePath,
        );
        break;
      case 'preview':
        await this.processPreviewGeneration(videoId, inputPath, outputBasePath);
        break;
      case 'transcode':
        await this.processTranscoding(videoId, inputPath, outputBasePath);
        break;
      default:
        throw new Error('Unknown job type');
    }
  }

  /**
   * Extract metadata from video file
   */
  private async processMetadataExtraction(
    videoId: string,
    inputPath: string,
  ): Promise<void> {
    console.log(`Extracting metadata for video ${videoId}`);

    // Extract metadata using video uploading service
    const metadata = this.videoUploadingService.extractVideoMetadata(inputPath);

    // Update video with extracted metadata
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }

    const videoMetadata = new VideoMetadata({
      duration: metadata.duration,
      fileSize: metadata.fileSize,
      resolution: metadata.resolution,
      format: metadata.format,
      bitrate: metadata.bitrate,
    });

    video.updateMetadata(videoMetadata);
    video.changeStatus(ProcessingStatus.PROCESSING);

    await this.videoRepository.save(video);
    console.log(`Metadata extraction completed for video ${videoId}`);
  }

  /**
   * Generate thumbnail for video
   */
  private async processThumbnailGeneration(
    videoId: string,
    inputPath: string,
    outputBasePath: string,
  ): Promise<void> {
    console.log(`Generating thumbnail for video ${videoId}`);

    const thumbnailPath = this.videoUploadingService.generateThumbnail(
      inputPath,
      outputBasePath,
      10, // Extract at 10 seconds
    );

    // Update video with thumbnail path
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }

    const updatedFilePaths = new VideoFilePaths({
      originalPath: video.filePaths?.originalPath || '',
      processedPath: video.filePaths?.processedPath || '',
      thumbnailUrl: thumbnailPath,
      hlsPlaylistUrl: video.filePaths?.hlsPlaylistUrl || '',
      dashManifestUrl: video.filePaths?.dashManifestUrl || '',
    });

    video.updateFilePaths(updatedFilePaths);
    await this.videoRepository.save(video);

    console.log(`Thumbnail generation completed for video ${videoId}`);
  }

  /**
   * Generate preview GIF for video
   */
  private async processPreviewGeneration(
    videoId: string,
    inputPath: string,
    outputBasePath: string,
  ): Promise<void> {
    console.log(`Generating preview for video ${videoId}`);

    const previewPath = this.videoUploadingService.generatePreviewGif(
      inputPath,
      outputBasePath,
      10, // Start at 10 seconds
      3, // 3 second duration
    );

    // Update video with preview path
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }

    console.log(
      `Preview generation completed for video ${videoId}: ${previewPath}`,
    );
  }

  /**
   * Transcode video to multiple qualities
   */
  private async processTranscoding(
    videoId: string,
    inputPath: string,
    outputBasePath: string,
  ): Promise<void> {
    console.log(`Transcoding video ${videoId}`);

    // Generate multiple quality versions
    const qualities = this.videoUploadingService.transcodeVideo(
      inputPath,
      outputBasePath,
    );

    // Generate HLS playlist
    const hlsPlaylistPath = this.videoUploadingService.generateHLSPlaylist(
      qualities,
      outputBasePath,
    );

    // Update video with transcoded file paths
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }

    const updatedFilePaths = new VideoFilePaths({
      originalPath: video.filePaths?.originalPath || '',
      processedPath: qualities[0]?.path || '', // Use highest quality as processed path
      thumbnailUrl: video.filePaths?.thumbnailUrl || '',
      hlsPlaylistUrl: hlsPlaylistPath,
      dashManifestUrl: video.filePaths?.dashManifestUrl || '',
    });

    video.updateFilePaths(updatedFilePaths);
    video.changeStatus(ProcessingStatus.READY); // Video is ready for streaming

    await this.videoRepository.save(video);

    console.log(`Transcoding completed for video ${videoId}`);
    console.log(`Generated ${qualities.length} quality versions`);
  }

  /**
   * Utility method for sleeping
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
