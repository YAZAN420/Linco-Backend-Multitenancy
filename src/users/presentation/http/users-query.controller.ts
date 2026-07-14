import { Controller, Get, Param, Query } from '@nestjs/common';

import { UsersQueryService } from 'src/users/application/users-query.service';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { UsersCursorQueryDto } from './dto/user-cursor-query.dto';

import { Role } from 'src/users/domain/enums/role.enum';

@Controller('users')
export class UsersQueryController {
  constructor(
    private readonly userQueryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    const users = await this.userQueryService.findAll(pageOptionsDto);
    return {
      message: 'Users fetched successfully',
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
    const users = await this.userQueryService.findAllCursor(options);

    return {
      message: 'Users fetched successfully',
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
      message: 'User profile retrieved successfully',
      data: { user: this.userResponseMapper.toResponseFromPrisma(user) },
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
      message: 'User retrieved successfully',
      data: data,
    };
  }
}
