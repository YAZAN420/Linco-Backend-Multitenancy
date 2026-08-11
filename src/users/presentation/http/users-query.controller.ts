import { Controller, Get, Param, Query } from '@nestjs/common';

import { UsersQueryService } from 'src/users/application/users-query.service';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { UsersCursorQueryDto } from './dto/user-cursor-query.dto';

import { Role } from 'src/users/domain/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';

@ApiTags('User')
@Controller('users')
export class UsersQueryController {
  constructor(
    private readonly userQueryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Roles([Role.ADMIN])
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    const users = await this.userQueryService.findAll(
      activeUser.id,
      pageOptionsDto,
    );
    return {
      message: 'messages.USERS_FETCHED_SUCCESSFULLY',
      data: this.userResponseMapper.toResponseManyFromPrisma(
        users.data,
        activeUser.role,
      ),
      meta: users.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Query() options: UsersCursorQueryDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    const users = await this.userQueryService.findAllCursor(
      activeUser.id,
      options,
    );

    return {
      message: 'messages.USERS_FETCHED_SUCCESSFULLY',
      data: this.userResponseMapper.toResponseManyFromPrisma(
        users.data,
        activeUser.role,
      ),
      meta: users.meta,
    };
  }

  @Get('me')
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.userQueryService.findById(activeUser.id);

    return {
      message: 'messages.USER_PROFILE_RETRIEVED_SUCCESSFULLY',
      data: { user: this.userResponseMapper.toResponseFromPrisma(user) },
    };
  }

  @Roles([Role.ADMIN])
  @Get('stats')
  async getStats() {
    const stats = await this.userQueryService.getDashboardStats();
    return {
      message: 'messages.USER_STATS_FETCHED_SUCCESSFULLY',
      data: stats,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    const user = await this.userQueryService.findById(id);

    const data =
      activeUser.role === Role.ADMIN
        ? this.userResponseMapper.toResponseFromPrisma(user)
        : this.userResponseMapper.toPublicResponseFromPrisma(user);

    return {
      message: 'messages.USER_RETRIEVED_SUCCESSFULLY',
      data: data,
    };
  }
}
