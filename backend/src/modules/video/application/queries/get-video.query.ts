export class GetVideoQuery {
  constructor(
    public readonly videoId: string,
    public readonly userId?: string, // For checking ownership/access rights
  ) {}
}
