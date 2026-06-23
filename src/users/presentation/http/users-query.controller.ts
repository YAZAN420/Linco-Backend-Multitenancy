import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindUsersDto } from './dto/filters/find-users.dto';
import { FindUsersCursorDto } from './dto/filters/find-users-cursor.dto';

import { UsersQueryService } from 'src/users/application/users-query.service';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { UserResponseMapper } from './mappers/user-response.mapper';

@Controller('users')
export class UsersQueryController {
  constructor(
    private readonly userQueryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() pageOptionsDto: FindUsersDto) {
    const users = await this.userQueryService.findAll(pageOptionsDto);
    return {
      message: 'Users fetched successfully',
      data: this.userResponseMapper.toResponseManyFromPrisma(users.data),
      meta: users.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindUsersCursorDto) {
    const users = await this.userQueryService.findAllCursor(options);

    return {
      message: 'Users fetched successfully (Cursor)',
      data: this.userResponseMapper.toResponseManyFromPrisma(users.data),
      meta: users.meta,
    };
  }

  @Get('me')
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.userQueryService.findById(activeUser.id);

    return {
      message: 'User profile retrieved successfully',
      data: { user: this.userResponseMapper.toResponseFromPrisma(user) },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userQueryService.findById(id);

    return {
      message: 'User retrieved successfully',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }
}
