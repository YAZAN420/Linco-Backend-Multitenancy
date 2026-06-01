import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from '../interfaces/find-users.query';
import { User } from 'src/generated/prisma/client';

export abstract class UserQueryRepository {
  abstract findAll(options: FindUsersQuery): Promise<PageDto<User>>;
  abstract findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>>;
  abstract findById(id: string): Promise<User | null>;
}
