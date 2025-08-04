import { User } from '@/modules/user/domain/entities/user.entity';

export class VideoComment {
  constructor(
    public readonly id: string,
    public readonly videoId: string,
    public readonly userId: string,
    public readonly parentId: string | null,
    public readonly content: string,
    public readonly isEdited: boolean,
    public readonly likeCount: number,
    public readonly dislikeCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private readonly _user?: User,
    private readonly _replies?: VideoComment[],
  ) {}

  public get user(): User | undefined {
    return this._user;
  }

  public get replies(): VideoComment[] {
    return this._replies || [];
  }

  public isReply(): boolean {
    return this.parentId !== null;
  }

  public hasReplies(): boolean {
    return this.replies.length > 0;
  }

  public getTotalReactionCount(): number {
    return this.likeCount + this.dislikeCount;
  }

  public getNetScore(): number {
    return this.likeCount - this.dislikeCount;
  }
}
