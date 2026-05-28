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
import { UpdateUserDto } from './dto/update-profile.dto';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { UpdateUserProfileCommand } from 'src/users/application/commands/update-user-profile.command';
import { GetUserByIdQuery } from 'src/users/application/queries/get-user-by-id.query';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import type { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { CachePublic } from 'src/common/decorators/cache-public.decorator';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { FindUsersDto } from './dto/filters/find-users.dto';
import { FindUsersCursorDto } from './dto/filters/find-users-cursor.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandService: UsersCommandService,
    private readonly queryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
      new Date(dto.birthDate),
      dto.imagePath,
      dto.role,
    );
    const user = await this.commandService.create(command);

    return {
      message: 'User created successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Get()
  @CachePublic()
  async findAll(@Query() pageOptionsDto: FindUsersDto) {
    const users = await this.queryService.findAll(pageOptionsDto);

    return {
      message: 'Users fetched successfully',
      data: this.userResponseMapper.toResponseMany(users.data),
      meta: users.meta,
    };
  }

  @Get('cursor')
  @CachePublic()
  async findWithCursor(@Query() options: FindUsersCursorDto) {
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
    @Body() dto: UpdateUserDto,
  ) {
    const command = new UpdateUserProfileCommand(
      id,
      dto.firstName,
      dto.lastName,
      dto.birthDate ? new Date(dto.birthDate) : undefined,
      dto.imagePath,
    );
    const user = await this.commandService.update(activeUser, command);

    return {
      message: 'User updated successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

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
