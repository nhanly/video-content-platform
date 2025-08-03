import { PaginationMeta } from '@/shared/core/types/pagination.type';

import { Category } from '../entities/category.entity';

export interface CategoryFilters {
  name?: string;
  code?: string;
  isActive?: boolean;
  search?: string;
}

export interface CategorySortOptions {
  sortBy: 'name' | 'code' | 'sortOrder' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByCode(code: string): Promise<Category | null>;
  findAll(
    page: number,
    limit: number,
    filters?: CategoryFilters,
    sortOptions?: CategorySortOptions,
  ): Promise<{
    data: Category[];
    meta: PaginationMeta;
  }>;
  create(category: Category): Promise<Category>;
  update(id: string, category: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
