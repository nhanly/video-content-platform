import { ClientInfo } from '@/user/domain/value-objects/client-info.vo';

export interface UserSessionProps {
  id: string;
  sessionToken: string;
  refreshToken: string;
  expiresAt: Date;
  lastAccess: Date;
  clientInfo: ClientInfo;
}

export class UserSession {
  public readonly id: string;
  public readonly sessionToken: string;
  public readonly refreshToken: string;
  public readonly expiresAt: Date;
  public readonly lastAccessed: Date;
  public readonly clientInfo: ClientInfo;

  constructor(public readonly props: UserSessionProps) {
    this.id = props.id;
    this.sessionToken = props.sessionToken;
    this.refreshToken = props.refreshToken;
    this.expiresAt = props.expiresAt;
    this.lastAccessed = props.lastAccess;
    this.clientInfo = props.clientInfo;
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
