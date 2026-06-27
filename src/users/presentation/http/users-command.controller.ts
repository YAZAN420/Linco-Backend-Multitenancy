import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserResponseMapper } from './mappers/user-response.mapper';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';

@Controller('users')
export class UsersCommandController {
  constructor(
    private readonly userCommandService: UsersCommandService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Post('upload-url')
  async asyncgetUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.userCommandService.generateDemoImageUploadUrl(
      dto.fileName,
    );
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userCommandService.create(dto);

    return {
      message: 'User created successfully',
      data: this.userResponseMapper.toResponseFromDomain(user),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userCommandService.update(id, dto);

    return {
      message: 'User updated successfully',
      data: this.userResponseMapper.toResponseFromDomain(user),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userCommandService.remove(id);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
