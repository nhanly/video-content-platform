import { BaseEntity } from '@/modules/common/base.entity';

export class Category extends BaseEntity<string> {
  constructor(
    id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly description?: string,
    public readonly thumbnailUrl?: string,
    public readonly parentId?: string,
    public readonly sortOrder?: number,
    public isActive?: boolean,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }

  public activate() {
    this.isActive = true;
  }

  public deactivate() {
    this.isActive = false;
  }
}
