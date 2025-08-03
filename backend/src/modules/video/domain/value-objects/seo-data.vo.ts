import { BaseValueObject } from '@/modules/common/base.vo';

interface SeoDataProps {
  metaDescription: string;
  metaTitle: string;
}

export class SeoData extends BaseValueObject<SeoDataProps> {
  get metaDescription(): string {
    return this.props.metaDescription;
  }

  get metaTitle(): string {
    return this.props.metaTitle;
  }
}
