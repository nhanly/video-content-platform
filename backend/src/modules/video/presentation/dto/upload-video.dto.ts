import { ApiProperty } from '@nestjs/swagger';

import { VideoVisibility } from '@/video/domain/entities/video.entity';

export class UploadVideoDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  video: any;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: true })
  categoryId: string;

  @ApiProperty({ enum: VideoVisibility, required: true })
  visibility: VideoVisibility;
}
