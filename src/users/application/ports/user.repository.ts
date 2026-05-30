import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import { User } from 'src/users/domain/user';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from '../interfaces/find-users.query';

export abstract class UserRepository {
  abstract findAll(options: FindUsersQuery): Promise<PageDto<User>>;
  abstract findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByVerificationToken(token: string): Promise<User | null>;
  abstract findByResetToken(token: string): Promise<User | null>;
}
