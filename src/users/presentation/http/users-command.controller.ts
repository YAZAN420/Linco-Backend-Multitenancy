import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserResponseMapper } from './mappers/user-response.mapper';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';
import { ClearCache } from 'src/common/decorators/clear-cache.decorator';
import { UsersQueryService } from 'src/users/application/users-query.service';

@Controller('users')
export class UsersCommandController {
  constructor(
    private readonly userCommandService: UsersCommandService,
    private readonly userQueryService: UsersQueryService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Public()
  @Post('upload-url')
  async getUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.userCommandService.generateDemoImageUploadUrl(
      dto.fileName,
    );
  }

  @Post()
  @ClearCache(['GET:/users', 'GET:/users?*', 'GET:/users/cursor*'])
  async create(@Body() dto: CreateUserDto) {
    const createdUser = await this.userCommandService.create(dto);
    const user = await this.userQueryService.findById(createdUser.id);
    return {
      message: 'User created successfully',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }

  @Patch(':id')
  @ClearCache(['GET:/users', 'GET:/users?*', 'GET:/users/cursor*'])
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updatedUser = await this.userCommandService.update(id, dto);
    const user = await this.userQueryService.findById(updatedUser.id);

    return {
      message: 'User updated successfully',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }

  @Delete(':id')
  @ClearCache(['GET:/users', 'GET:/users?*', 'GET:/users/cursor*'])
  async remove(@Param('id') id: string) {
    await this.userCommandService.remove(id);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
