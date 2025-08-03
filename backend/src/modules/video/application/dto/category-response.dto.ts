import { ApiProperty } from '@nestjs/swagger';

import { PaginationMeta } from '@/shared/core/types/pagination.type';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'cuid123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Music',
  })
  name: string;

  @ApiProperty({
    description: 'Category code',
    example: 'music',
  })
  code: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Music videos and performances',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Category thumbnail URL',
    example: 'https://example.com/thumbnails/music.jpg',
    required: false,
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Category creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class PaginatedCategoryResponse {
  @ApiProperty({
    description: 'List of categories',
    type: CategoryResponseDto,
    isArray: true,
  })
  data: CategoryResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 50,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: false,
    },
  })
  meta: PaginationMeta;
}
