export class ListVideosQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly categoryId?: string,
    public readonly userId?: string,
    public readonly status?: string,
    public readonly visibility?: string,
    public readonly sortBy?: string,
    public readonly sortOrder?: 'asc' | 'desc',
    public readonly search?: string,
  ) {}
}
