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
import { UpdateUserDto } from './dto/update-user.dto';

import type { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { FindUsersDto } from './dto/filters/find-users.dto';
import { FindUsersCursorDto } from './dto/filters/find-users-cursor.dto';
import { UsersService } from 'src/users/application/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return {
      message: 'User created successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Get()
  async findAll(@Query() pageOptionsDto: FindUsersDto) {
    const users = await this.userService.findAll(pageOptionsDto);
    return {
      message: 'Users fetched successfully',
      data: this.userResponseMapper.toResponseMany(users.data),
      meta: users.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindUsersCursorDto) {
    const result = await this.userService.findAllCursor(options);

    return {
      message: 'Users fetched successfully (Cursor)',
      data: this.userResponseMapper.toResponseMany(result.data),
      meta: result.meta,
    };
  }

  @Get('me')
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.userService.findById(activeUser.id);

    return {
      message: 'User profile retrieved successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    return {
      message: 'User retrieved successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);

    return {
      message: 'User updated successfully',
      data: this.userResponseMapper.toResponse(user),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
