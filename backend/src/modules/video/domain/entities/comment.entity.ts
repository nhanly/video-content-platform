import { BaseEntity } from '@/modules/common/base.entity';

export class Comment extends BaseEntity<string> {
  constructor(
    id: string,
    public readonly videoId: string,
    public readonly authorId: string,
    public readonly createdAt: Date,
    public content: string,
  ) {
    super(id);
  }

  public edit(newContent: string) {
    this.content = newContent;
  }
}
