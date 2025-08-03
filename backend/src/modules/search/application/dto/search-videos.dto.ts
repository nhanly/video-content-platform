import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchVideosDto {
  @ApiProperty({ description: 'Search query', example: 'cooking tutorial' })
  @IsString()
  query: string;

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

  @ApiProperty({
    description: 'Filter by category IDs',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiProperty({
    description: 'Filter by tags',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Filter by user ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    enum: ['relevance', 'createdAt', 'viewCount', 'duration'],
    default: 'relevance',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'relevance';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ description: 'Minimum duration in seconds', required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  minDuration?: number;

  @ApiProperty({ description: 'Maximum duration in seconds', required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  maxDuration?: number;

  @ApiProperty({ description: 'Date range from (ISO string)', required: false })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiProperty({ description: 'Date range to (ISO string)', required: false })
  @IsOptional()
  @IsString()
  dateTo?: string;
}
