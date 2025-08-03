export class SearchVideosQuery {
  constructor(
    public readonly query: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly categoryIds?: string[],
    public readonly tags?: string[],
    public readonly userId?: string,
    public readonly sortBy?: string,
    public readonly sortOrder?: 'asc' | 'desc',
    public readonly minDuration?: number,
    public readonly maxDuration?: number,
    public readonly dateFrom?: string,
    public readonly dateTo?: string,
  ) {}
}

export class SearchSuggestionsQuery {
  constructor(
    public readonly query: string,
    public readonly limit: number = 10,
  ) {}
}
