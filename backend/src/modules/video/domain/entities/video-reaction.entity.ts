import { ReactionType } from '@prisma/client';

import { User } from '@/modules/user/domain/entities/user.entity';

export class VideoReaction {
  constructor(
    public readonly id: string,
    public readonly videoId: string,
    public readonly userId: string,
    public readonly reactionType: ReactionType,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    private readonly _user?: User,
  ) {}

  public get user(): User | undefined {
    return this._user;
  }

  public isLike(): boolean {
    return this.reactionType === ReactionType.LIKE;
  }

  public isDislike(): boolean {
    return this.reactionType === ReactionType.DISLIKE;
  }

  public wasModified(): boolean {
    return this.createdAt.getTime() !== this.updatedAt.getTime();
  }
}
