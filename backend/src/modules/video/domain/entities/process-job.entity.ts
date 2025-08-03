export class ProcessingJob {
  constructor(
    public readonly id: string,
    public readonly videoId: string,
    public readonly jobType: ProcessingJobType,
    public readonly scheduledAt: Date,
    public readonly createdAt: Date,
    private _status: JobStatus,
    private _attempts: number,
    private _maxAttempts: number,
    private _errorMessage?: string,
    private _metadata?: Record<string, any>,
    public startedAt?: Date,
    public completedAt?: Date,
  ) {}

  public start(): void {
    if (this._status !== JobStatus.PENDING) {
      throw new Error('Job is not pending');
    }
    this._status = JobStatus.PROCESSING;
    this.startedAt = new Date();
    this._attempts += 1;
  }

  public complete(): void {
    this._status = JobStatus.COMPLETED;
    this.completedAt = new Date();
  }

  public fail(error: string): void {
    this._errorMessage = error;
    if (this._attempts >= this._maxAttempts) {
      this._status = JobStatus.FAILED;
    } else {
      this._status = JobStatus.PENDING;
    }
  }

  public canRetry(): boolean {
    return (
      this._attempts < this._maxAttempts && this._status !== JobStatus.COMPLETED
    );
  }

  // Getters
  public get status(): JobStatus {
    return this._status;
  }
  public get attempts(): number {
    return this._attempts;
  }
  public get errorMessage(): string | undefined {
    return this._errorMessage;
  }
}

export enum ProcessingJobType {
  TRANSCODE = 'transcode',
  THUMBNAIL = 'thumbnail',
  PREVIEW = 'preview',
  METADATA_EXTRACTION = 'metadata_extraction',
}

export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
