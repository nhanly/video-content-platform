export class ListCategoriesQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly name?: string,
    public readonly code?: string,
    public readonly isActive?: boolean,
    public readonly search?: string,
    public readonly sortBy:
      | 'name'
      | 'code'
      | 'sortOrder'
      | 'createdAt' = 'sortOrder',
    public readonly sortOrder: 'asc' | 'desc' = 'asc',
  ) {}
}
