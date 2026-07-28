import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from './interfaces/find-users.query';
import { User } from 'src/generated/prisma/client';
import { UserQueryRepository } from './ports/user-query.repository';

@Injectable()
export class UsersQueryService {
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async findAll(
    currentUserId: string,
    pageOptionsDto: FindUsersQuery,
  ): Promise<PageDto<User>> {
    return this.userQueryRepository.findAll(currentUserId, pageOptionsDto);
  }

  async findAllCursor(
    currentUserId: string,
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    return this.userQueryRepository.findAllCursor(currentUserId, options);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userQueryRepository.findById(id);
    if (!user) throw new NotFoundException('errors.USER_NOT_FOUND');
    return user;
  }
}
