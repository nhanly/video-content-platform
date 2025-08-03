import { Injectable } from '@nestjs/common';

export interface QueueJob {
  id: string;
  type: string;
  data: unknown;
  priority: number;
  attempts: number;
  maxAttempts: number;
  delay?: number;
}

export interface QueueJobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
}

@Injectable()
export class QueueService {
  private readonly queues: Map<string, QueueJob[]> = new Map();

  /**
   * Add a job to the specified queue
   */
  addJob(
    queueName: string,
    jobType: string,
    data: unknown,
    options: QueueJobOptions = {},
  ): string {
    const jobId = crypto.randomUUID();

    const job: QueueJob = {
      id: jobId,
      type: jobType,
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.attempts || 3,
      delay: options.delay,
    };

    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const queue = this.queues.get(queueName);
    queue.push(job);

    // Sort by priority (higher priority first)
    queue.sort((a, b) => b.priority - a.priority);

    console.log(`Job ${jobId} added to queue ${queueName}`);
    return jobId;
  }

  /**
   * Get next job from queue
   */
  getNextJob(queueName: string): QueueJob | null {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) {
      return null;
    }

    return queue.shift() || null;
  }

  /**
   * Mark job as completed
   */
  completeJob(queueName: string, jobId: string): void {
    console.log(`Job ${jobId} completed in queue ${queueName}`);
  }

  /**
   * Mark job as failed
   */
  failJob(queueName: string, jobId: string, error: string): void {
    console.log(`Job ${jobId} failed in queue ${queueName}: ${error}`);
  }

  /**
   * Get queue statistics
   */
  getQueueStats(queueName: string): {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  } {
    const queue = this.queues.get(queueName);
    const waiting = queue ? queue.length : 0;

    return {
      waiting,
      active: 0, // Would be tracked separately in real implementation
      completed: 0, // Would be tracked separately in real implementation
      failed: 0, // Would be tracked separately in real implementation
    };
  }
}
