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

  async findAll(pageOptionsDto: FindUsersQuery): Promise<PageDto<User>> {
    return this.userQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    return this.userQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userQueryRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
