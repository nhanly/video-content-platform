import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import * as bcrypt from 'bcryptjs';

import { Email } from '@/common/email.vo';
import { UserProfile } from '@/user/domain/value-objects/user-profile.vo';

import { UserSession } from './user-session.entity';

interface UserProps {
  id: string;
  username: string;
  email: Email;
  passwordHash: string;
  profile: UserProfile;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  sessions: UserSession[];
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<IEvent> {
  constructor(private props: UserProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  get username() {
    return this.props.username;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get profile() {
    return this.props.profile;
  }

  get role() {
    return this.props.role;
  }

  get isActive() {
    return this.props.isActive;
  }

  get emailVerified() {
    return this.props.emailVerified;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  // Method to get all sessions
  get sessions(): UserSession[] {
    return this.props.sessions;
  }

  public updateProfile(profile: UserProfile) {
    this.props.profile = profile;
  }

  // Method to add a new session
  public addSession(session: UserSession): void {
    this.props.sessions.push(session);
  }

  public changePassword(newPassword: string): void {
    this.props.passwordHash = this.hashPassword(newPassword);
    this.props.updatedAt = new Date();
  }

  public isPasswordValid(password: string): boolean {
    return this.validatePassword(password, this.props.passwordHash);
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  // Factory method for creating a new user
  public static create(initialProps: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    role: UserRole;
  }): UserProps {
    const now = new Date();

    return new User({
      ...initialProps,
      profile: new UserProfile(null),
      email: new Email(initialProps.email),
      isActive: true,
      emailVerified: false,
      sessions: [],
      createdAt: now,
    });
  }
}

export enum UserRole {
  ADMIN,
  MODERATOR,
  CREATOR,
  USER,
}
