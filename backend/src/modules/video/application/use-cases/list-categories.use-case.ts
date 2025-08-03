import { Inject, Injectable } from '@nestjs/common';

import {
  CategoryFilters,
  CategorySortOptions,
  ICategoryRepository,
} from '../../domain/repositories/category.repository.interface';
import {
  CategoryResponseDto,
  PaginatedCategoryResponse,
} from '../dto/category-response.dto';
import { ListCategoriesQuery } from '../queries/list-categories.query';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    query: ListCategoriesQuery,
  ): Promise<PaginatedCategoryResponse> {
    const filters: CategoryFilters = {
      name: query.name,
      code: query.code,
      isActive: query.isActive,
      search: query.search,
    };

    const sortOptions: CategorySortOptions = {
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await this.categoryRepository.findAll(
      query.page,
      query.limit,
      filters,
      sortOptions,
    );

    const data: CategoryResponseDto[] = result.data.map((category) => ({
      id: category.id,
      name: category.name,
      code: category.code,
      description: category.description,
      thumbnailUrl: category.thumbnailUrl,
      parentId: category.parentId,
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive ?? true,
      createdAt: category.createdAt,
    }));

    return {
      data,
      meta: result.meta,
    };
  }
}
