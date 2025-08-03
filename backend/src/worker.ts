import { NestFactory } from '@nestjs/core';

import { VideoProcessingWorker } from '@/video/infrastructure/workers/video-processing.worker';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const videoWorker = app.get(VideoProcessingWorker);

  console.log('🚀 Starting video processing worker...');

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    void (async () => {
      console.log('📤 Received SIGTERM, shutting down gracefully...');
      videoWorker.stopProcessing();
      await app.close();
      process.exit(0);
    })();
  });

  process.on('SIGINT', () => {
    void (async () => {
      console.log('📤 Received SIGINT, shutting down gracefully...');
      videoWorker.stopProcessing();
      await app.close();
      process.exit(0);
    })();
  });

  // Start processing
  await videoWorker.startProcessing();
}

bootstrap().catch((error) => {
  console.error('❌ Error starting worker:', error);
  process.exit(1);
});
