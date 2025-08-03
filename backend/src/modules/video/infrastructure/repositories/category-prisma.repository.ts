import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationMeta } from '@/shared/core/types/pagination.type';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';

import { Category } from '../../domain/entities/category.entity';
import {
  CategoryFilters,
  CategorySortOptions,
  ICategoryRepository,
} from '../../domain/repositories/category.repository.interface';

@Injectable()
export class CategoryPrismaRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return this.mapToCategory(category);
  }

  async findByCode(code: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { code },
    });

    if (!category) return null;

    return this.mapToCategory(category);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: CategoryFilters = {},
    sortOptions: CategorySortOptions = {
      sortBy: 'sortOrder',
      sortOrder: 'asc',
    },
  ): Promise<{
    data: Category[];
    meta: PaginationMeta;
  }> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(sortOptions);

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    const data = await Promise.all(
      categories.map((category) => this.mapToCategory(category)),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        code: category.code,
        description: category.description,
        thumbnailUrl: category.thumbnailUrl,
        parentId: category.parentId,
        sortOrder: category.sortOrder || 0,
        isActive: category.isActive ?? true,
      },
    });

    return this.mapToCategory(created);
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: categoryData.name,
        code: categoryData.code,
        description: categoryData.description,
        thumbnailUrl: categoryData.thumbnailUrl,
        parentId: categoryData.parentId,
        sortOrder: categoryData.sortOrder,
        isActive: categoryData.isActive,
      },
    });

    return this.mapToCategory(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  private buildWhereClause(
    filters: CategoryFilters,
  ): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.code) {
      where.code = filters.code;
    }

    if (filters.isActive) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private buildOrderBy(
    sortOptions: CategorySortOptions,
  ): Prisma.CategoryOrderByWithRelationInput {
    const { sortBy, sortOrder } = sortOptions;

    const orderByMap: Record<string, string> = {
      name: 'name',
      code: 'code',
      sortOrder: 'sortOrder',
      createdAt: 'createdAt',
    };

    return {
      [orderByMap[sortBy]]: sortOrder,
    };
  }

  private mapToCategory(categoryData: any): Category {
    const category = new Category(
      categoryData.id,
      categoryData.name,
      categoryData.code,
      categoryData.description,
      categoryData.thumbnailUrl,
      categoryData.parentId,
      categoryData.sortOrder,
      categoryData.isActive,
      categoryData.createdAt,
    );

    return category;
  }
}
