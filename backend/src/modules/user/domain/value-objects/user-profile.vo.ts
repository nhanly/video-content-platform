import { BaseValueObject } from '@/modules/common/base.vo';

export interface ProfileProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export class UserProfile extends BaseValueObject<ProfileProps> {
  get displayName() {
    return this.props.firstName + ' ' + this.props.lastName;
  }
  get avatarUrl() {
    return this.props.avatarUrl;
  }
}
