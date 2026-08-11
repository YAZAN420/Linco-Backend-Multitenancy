import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from '../interfaces/find-users.query';
import { User } from 'src/generated/prisma/client';
import { UserDashboardStats } from 'src/core/database/prisma/types';

export abstract class UserQueryRepository {
  abstract findAll(
    currentUserId: string,
    options: FindUsersQuery,
  ): Promise<PageDto<User>>;
  abstract findAllCursor(
    currentUserId: string,
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>>;
  abstract findById(id: string): Promise<User | null>;
  abstract getUserDashboardStats(): Promise<UserDashboardStats>;
}
