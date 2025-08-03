/* eslint-disable @typescript-eslint/require-await */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'amqplib';

import { VideoProcessingJob } from '@/modules/video/application/types/video.type';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any;
  private channel: any;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const rabbitmqConfig = this.configService.get('rabbitmq');
      if (!rabbitmqConfig) {
        throw new Error('RabbitMQ configuration not found');
      }
      this.connection = await connect(rabbitmqConfig.url);

      this.connection.on('error', (err: Error) => {
        if (err.message !== 'Connection closing') {
          this.logger.error('RabbitMQ connection error:', err.message);
        }
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed');
      });

      this.channel = await this.connection.createChannel();

      // Create exchanges
      await this.channel.assertExchange(
        rabbitmqConfig.exchanges?.videoProcessing || 'video.processing',
        'direct',
        { durable: true },
      );
      await this.channel.assertExchange(
        rabbitmqConfig.exchanges?.notifications || 'notifications',
        'fanout',
        { durable: true },
      );
      await this.channel.assertExchange(
        rabbitmqConfig.exchanges?.analytics || 'analytics',
        'fanout',
        { durable: true },
      );

      // Create dead-letter exchange and queue
      await this.channel.assertExchange(rabbitmqConfig.dlx || 'dlx', 'direct', {
        durable: true,
      });
      await this.channel.assertQueue(rabbitmqConfig.queues?.dlq || 'dlq', {
        durable: true,
      });
      await this.channel.bindQueue(
        rabbitmqConfig.queues?.dlq || 'dlq',
        rabbitmqConfig.dlx || 'dlx',
        'video.processing',
      );

      // Create video processing queue with dead-letter configuration
      await this.channel.assertQueue(
        rabbitmqConfig.queues?.videoProcessing || 'video.processing',
        {
          durable: true,
          deadLetterExchange: rabbitmqConfig.dlx || 'dlx',
          deadLetterRoutingKey: 'video.processing',
          arguments: {
            'x-max-priority': 10,
            'x-message-ttl': 86400000, // 24 hours
          },
        },
      );

      await this.channel.bindQueue(
        rabbitmqConfig.queues?.videoProcessing || 'video.processing',
        rabbitmqConfig.exchanges?.videoProcessing || 'video.processing',
        'video.processing',
      );

      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishVideoProcessingJob(job: VideoProcessingJob): Promise<void> {
    try {
      const rabbitmqConfig = this.configService.get('rabbitmq');
      if (!rabbitmqConfig) {
        throw new Error('RabbitMQ configuration not found');
      }
      const jobBuffer = Buffer.from(JSON.stringify(job));

      this.channel.publish(
        rabbitmqConfig.exchanges?.videoProcessing || 'video.processing',
        'video.processing',
        jobBuffer,
        {
          persistent: true,
          priority: job.priority || 5,
          headers: {
            'x-retry-count': 0,
            'x-original-queue':
              rabbitmqConfig.queues?.videoProcessing || 'video.processing',
          },
        },
      );

      this.logger.log(`Published video processing job: ${job.videoId}`);
    } catch (error) {
      this.logger.error(
        'Failed to publish video processing job:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw error;
    }
  }

  async consumeVideoProcessingQueue(
    handler: (job: VideoProcessingJob) => Promise<void>,
  ): Promise<void> {
    const rabbitmqConfig = this.configService.get<{
      url: string;
      exchanges: {
        videoProcessing: string;
        notifications: string;
        analytics: string;
      };
      queues: {
        videoProcessing: string;
        dlq: string;
      };
      dlx: string;
    }>('rabbitmq', { infer: true });
    if (!rabbitmqConfig) {
      throw new Error('RabbitMQ configuration not found');
    }

    await this.channel.consume(
      rabbitmqConfig.queues?.videoProcessing || 'video.processing',
      async (msg: any) => {
        if (msg) {
          try {
            const job = JSON.parse(
              msg.content.toString(),
            ) as VideoProcessingJob;
            await handler(job);

            // Acknowledge the message
            this.channel.ack(msg);
            this.logger.log(`Processed video processing job: ${job.videoId}`);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : JSON.stringify(error);
            this.logger.error(
              `Failed to process video processing job: ${errorMessage}`,
            );

            // Handle retry logic
            const retryCount =
              (msg.properties.headers?.['x-retry-count'] as number) || 0;
            const maxAttempts =
              this.configService.get<number>('video.processing.maxAttempts') ||
              3;

            if (retryCount < maxAttempts) {
              // Requeue with backoff
              this.channel.nack(msg, false, true);

              // Get job from parsed message
              let jobVideoId = 'unknown';
              try {
                const job = JSON.parse(
                  msg.content.toString(),
                ) as VideoProcessingJob;
                jobVideoId = job.videoId;
              } catch {
                // ignore parsing error for logging
              }

              this.logger.log(
                `Requeuing video processing job ${jobVideoId} (attempt ${retryCount + 1}/${maxAttempts})`,
              );
            } else {
              // Move to DLQ
              this.channel.nack(msg, false, false);

              // Get job from parsed message
              let jobVideoId = 'unknown';
              try {
                const job = JSON.parse(
                  msg.content.toString(),
                ) as VideoProcessingJob;
                jobVideoId = job.videoId;
              } catch {
                // ignore parsing error for logging
              }

              this.logger.error(
                `Moving video processing job ${jobVideoId} to DLQ after ${maxAttempts} attempts`,
              );
            }
          }
        }
      },
    );
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
