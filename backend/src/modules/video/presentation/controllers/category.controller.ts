import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginatedCategoryResponse } from '@/video/application/dto/category-response.dto';
import { ListCategoriesDto } from '@/video/application/dto/list-categories.dto';
import { ListCategoriesQuery } from '@/video/application/queries/list-categories.query';
import { ListCategoriesUseCase } from '@/video/application/use-cases/list-categories.use-case';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List categories with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (max 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by category name (partial match)',
    example: 'music',
  })
  @ApiQuery({
    name: 'code',
    required: false,
    type: String,
    description: 'Filter by category code',
    example: 'music',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
    example: true,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in category name and description',
    example: 'gaming',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'code', 'sortOrder', 'createdAt'],
    description: 'Sort by field',
    example: 'sortOrder',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: PaginatedCategoryResponse,
  })
  @UseInterceptors(CacheInterceptor)
  async listCategories(
    @Query() listCategoriesDto: ListCategoriesDto,
  ): Promise<{ success: boolean; data: PaginatedCategoryResponse }> {
    const query = new ListCategoriesQuery(
      listCategoriesDto.page,
      listCategoriesDto.limit,
      listCategoriesDto.name,
      listCategoriesDto.code,
      listCategoriesDto.isActive,
      listCategoriesDto.search,
      listCategoriesDto.sortBy,
      listCategoriesDto.sortOrder,
    );

    const result = await this.listCategoriesUseCase.execute(query);

    return { success: true, data: result };
  }
}
