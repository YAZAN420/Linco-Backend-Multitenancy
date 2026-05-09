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
import { UserResponseMapper } from './mappers/user-response.mapper';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandService: UsersCommandService,
    private readonly queryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Roles([Role.ADMIN])
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
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Roles([Role.ADMIN])
  @Get()
  @CachePublic()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const users = await this.queryService.findAll(pageOptionsDto);

    return {
      message: 'Users fetched successfully',
      data: this.userResponseMapper.toResponseMany(users.data),
      meta: users.meta,
    };
  }

  @Roles([Role.ADMIN])
  @Get('cursor')
  @CachePublic()
  async findWithCursor(@Query() options: CursorPageOptionsDto) {
    const result = await this.queryService.findAllCursor(options);

    return {
      message: 'Users fetched successfully (Cursor)',
      data: this.userResponseMapper.toResponseMany(result.data),
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
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Roles([Role.ADMIN])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.queryService.findById(new GetUserByIdQuery(id));

    return {
      message: 'User retrieved successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

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
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Roles([Role.ADMIN])
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
