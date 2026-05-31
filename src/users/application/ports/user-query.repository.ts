import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from '../interfaces/find-users.query';
import { User } from 'src/generated/prisma/browser';
import { WithRealtionsDto } from 'src/common/dtos/with-realtions.dto';

export abstract class UserQueryRepository {
  abstract findAll(options: FindUsersQuery): Promise<PageDto<User>>;
  abstract findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>>;
  abstract findById(
    id: string,
    options?: WithRealtionsDto,
  ): Promise<User | null>;
}
