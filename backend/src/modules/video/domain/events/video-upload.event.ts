import { IEvent } from '@nestjs/cqrs/dist/interfaces';

export class VideoUploadedEvent implements IEvent {
  constructor(
    public readonly videoId: string,
    public readonly userId: string,
  ) {}
}
