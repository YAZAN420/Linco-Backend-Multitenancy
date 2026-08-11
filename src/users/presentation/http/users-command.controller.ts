import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

import { UserResponseMapper } from './mappers/user-response.mapper';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';

import { UsersQueryService } from 'src/users/application/users-query.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@ApiTags('User')
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

  @Roles([Role.ADMIN])
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const createdUser = await this.userCommandService.create(dto);
    const user = await this.userQueryService.findById(createdUser.id);
    return {
      message: 'messages.USER_CREATED_SUCCESSFULLY',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }

  @Patch()
  async updateProfile(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userCommandService.updateProfile(
      activeUser.id,
      dto,
    );
    const user = await this.userQueryService.findById(updatedUser.id);

    return {
      message: 'messages.USER_UPDATED_SUCCESSFULLY',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }

  @Roles([Role.ADMIN])
  @Delete(':id')
  async suspend(@Param('id') id: string) {
    await this.userCommandService.suspend(id);

    return {
      message: 'messages.USER_SUSPENDED_SUCCESSFULLY',
      data: null,
    };
  }

  @Roles([Role.ADMIN])
  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    await this.userCommandService.activate(id);

    return {
      message: 'messages.USER_ACTIVATED_SUCCESSFULLY',
      data: null,
    };
  }

  @Roles([Role.ADMIN])
  @Patch(':id')
  async updateByAdmin(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    const updatedUser = await this.userCommandService.updateByAdmin(id, dto);
    const user = await this.userQueryService.findById(updatedUser.id);

    return {
      message: 'messages.USER_UPDATED_BY_ADMIN_SUCCESSFULLY',
      data: this.userResponseMapper.toResponseFromPrisma(user),
    };
  }
}
