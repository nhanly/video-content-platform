import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListVideosDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Filter by category ID', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'Filter by user ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Filter by processing status',
    required: false,
    enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'],
  })
  @IsOptional()
  @IsEnum(['UPLOADING', 'PROCESSING', 'READY', 'FAILED'])
  status?: string;

  @ApiProperty({
    description: 'Filter by visibility',
    required: false,
    enum: ['PUBLIC', 'PRIVATE'],
  })
  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  visibility?: string;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    enum: ['createdAt', 'updatedAt', 'title', 'viewCount'],
  })
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'title', 'viewCount'])
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ description: 'Search query', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
