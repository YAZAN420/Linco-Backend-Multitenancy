import { User } from 'src/users/domain/user';

export abstract class UserCommandRepository {
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByVerificationToken(token: string): Promise<User | null>;
  abstract findByResetToken(token: string): Promise<User | null>;
}
