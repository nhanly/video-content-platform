import { VideoVisibility } from '@/video/domain/entities/video.entity';

export class UploadVideoCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly visibility: VideoVisibility,
    public readonly file: Express.Multer.File,
    public readonly userId: string,
  ) {}
}
