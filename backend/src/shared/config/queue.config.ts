import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  exchanges: {
    videoProcessing: 'video.processing',
    notifications: 'notifications',
    analytics: 'analytics',
  },
  queues: {
    videoProcessing:
      process.env.RABBITMQ_VIDEO_PROCESSING_QUEUE || 'video.processing.queue',
    dlq: process.env.RABBITMQ_DLQ || 'video.dlq',
  },
  dlx: process.env.RABBITMQ_DLX || 'video.dlx',
}));
