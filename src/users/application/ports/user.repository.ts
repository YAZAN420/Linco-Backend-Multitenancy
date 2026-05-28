import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import { User } from 'src/users/domain/user';
import { FindUsersCursorDto } from 'src/users/presentation/http/dto/filters/find-users-cursor.dto';
import { FindUsersDto } from 'src/users/presentation/http/dto/filters/find-users.dto';

export abstract class UserRepository {
  abstract findAll(options: FindUsersDto): Promise<PageDto<User>>;
  abstract findAllCursor(
    options: FindUsersCursorDto,
  ): Promise<CursorPageDto<User>>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByVerificationToken(token: string): Promise<User | null>;
  abstract findByResetToken(token: string): Promise<User | null>;
}
