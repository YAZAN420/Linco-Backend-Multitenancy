import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { UpdateUserProfileCommand } from 'src/users/application/commands/update-user-profile.command';
import { GetUserByIdQuery } from 'src/users/application/queries/get-user-by-id.query';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import type { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { CachePublic } from 'src/common/decorators/cache-public.decorator';
import { Role } from 'src/users/domain/enums/role.enum';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandService: UsersCommandService,
    private readonly queryService: UsersQueryService,
  ) {}

  @Roles([Role.Admin])
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(
      dto.username,
      dto.email,
      dto.password,
    );
    const user = await this.commandService.create(command);

    return {
      message: 'User created successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Roles([Role.Admin])
  @Get()
  @CachePublic()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const users = await this.queryService.findAll(pageOptionsDto);

    return {
      message: 'Users fetched successfully',
      data: users.data.map((user) => UserResponseDto.from(user)),
      meta: users.meta,
    };
  }

  @Roles([Role.Admin])
  @Get('cursor')
  @CachePublic()
  async findWithCursor(@Query() options: CursorPageOptionsDto) {
    const result = await this.queryService.findAllCursor(options);

    return {
      message: 'Users fetched successfully (Cursor)',
      data: result.data.map((user) => UserResponseDto.from(user)),
      meta: result.meta,
    };
  }

  @Get('me')
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.queryService.findById(
      new GetUserByIdQuery(activeUser.id),
    );

    return {
      message: 'User profile retrieved successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Roles([Role.Admin])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.queryService.findById(new GetUserByIdQuery(id));

    return {
      message: 'User retrieved successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Roles([Role.Admin])
  @Patch(':id')
  async update(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const command = new UpdateUserProfileCommand(id, dto.username);
    const user = await this.commandService.updateProfile(activeUser, command);

    return {
      message: 'User updated successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Roles([Role.Admin])
  @Delete(':id')
  async remove(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('id') id: string,
  ) {
    await this.commandService.remove(activeUser, id);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
