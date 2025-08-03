import { BaseValueObject } from '@/modules/common/base.vo';

export interface ClientInfoProps {
  ipAddress: string | null;
  userAgent: string | null;
}

export class ClientInfo extends BaseValueObject<ClientInfoProps> {
  get ipAddress() {
    return this.props.ipAddress;
  }
  get userAgent() {
    return this.props.userAgent;
  }
}
