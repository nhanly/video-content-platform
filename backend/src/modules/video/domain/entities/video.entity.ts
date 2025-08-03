import { AggregateRoot } from '@nestjs/cqrs';
import { IEvent } from '@nestjs/cqrs/dist/interfaces';

import { VideoFilePaths } from '../value-objects/video-filepath.vo';
import { VideoMetadata } from '../value-objects/video-metadata.vo';
import { Category } from './category.entity';
import { VideoQuality } from './video-quality.entity';

export enum ProcessingStatus {
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

export enum VideoVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class Video extends AggregateRoot<IEvent> {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly code: string,
    public readonly userId: string,
    public readonly categoryId: string,
    private _metadata: VideoMetadata,
    private _status: ProcessingStatus,
    private _filePaths: VideoFilePaths,
    private readonly _visibility: VideoVisibility,
    public readonly createdAt: Date,
    public updatedAt: Date,
    private readonly _category?: Category,
    private readonly _videoQualities?: VideoQuality[],
  ) {
    super();
  }

  public updateMetadata(metadata: VideoMetadata): void {
    this._metadata = metadata;
    this.updatedAt = new Date();
  }

  public changeStatus(status: ProcessingStatus): void {
    this._status = status;
    this.updatedAt = new Date();
  }

  public updateFilePaths(filePaths: VideoFilePaths): void {
    this._filePaths = filePaths;
    this.updatedAt = new Date();
  }

  public canBeProcessed(): boolean {
    return this._status === ProcessingStatus.UPLOADED;
  }

  public isPublic(): boolean {
    return (
      this._visibility === VideoVisibility.PUBLIC &&
      this._status === ProcessingStatus.READY
    );
  }

  // Getters
  public get metadata(): VideoMetadata {
    return this._metadata;
  }
  public get status(): ProcessingStatus {
    return this._status;
  }
  public get visibility(): VideoVisibility {
    return this._visibility;
  }
  public get filePaths(): VideoFilePaths {
    return this._filePaths;
  }
  public get videoQualities(): VideoQuality[] {
    return this._videoQualities;
  }
  public get category(): Category {
    return this._category;
  }
}
