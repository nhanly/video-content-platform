import { BaseEntity } from '@/modules/common/base.entity';

export class VideoQuality extends BaseEntity<string> {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly resolution: string,
    public readonly bitrate: number,
    public readonly filePath: string,
    public readonly fileSize: number | bigint,
    public readonly createdAt: Date,
  ) {
    super(id);
  }
}
