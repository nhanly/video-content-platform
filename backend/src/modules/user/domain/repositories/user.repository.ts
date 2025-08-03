import { User } from '@/modules/auth/domain/entities/user.entity';
import { Email } from '@/modules/common/email.vo';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract existsByEmail(email: Email): Promise<boolean>;
  abstract existsByUsername(username: string): Promise<boolean>;
}
