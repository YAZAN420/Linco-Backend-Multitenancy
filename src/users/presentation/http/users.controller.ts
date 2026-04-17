import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { PoliciesGuard } from 'src/iam/presentation/http/guards/policies.guard';
import { AuthorizationPort } from 'src/iam/application/ports/authorization.port';
import { CheckPolicies } from 'src/iam/presentation/http/decorators/check-policies.decorator';
import { User } from 'src/users/domain/user';
import { Action } from 'src/iam/domain/enums/action.enum';

@UseGuards(PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandService: UsersCommandService,
    private readonly queryService: UsersQueryService,
  ) {}

  @Post()
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Create, User),
  ])
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

  @Get()
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Read, User),
  ])
  async findAll() {
    const users = await this.queryService.findAll();

    return {
      message: 'Users retrieved successfully',
      data: UserResponseDto.fromMany(users),
    };
  }

  @Get('me')
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Read, User),
  ])
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    const user = await this.queryService.findById(
      new GetUserByIdQuery(activeUser.id),
    );

    return {
      message: 'User profile retrieved successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Get(':id')
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Read, User),
  ])
  async findOne(@Param('id') id: string) {
    const user = await this.queryService.findById(new GetUserByIdQuery(id));

    return {
      message: 'User retrieved successfully',
      data: UserResponseDto.from(user),
    };
  }

  @Patch(':id')
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Update, User),
  ])
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

  @Delete(':id')
  @CheckPolicies([
    (authPort: AuthorizationPort, user: ActiveUserData) =>
      authPort.checkPermission(user, Action.Delete, User),
  ])
  async remove(@Param('id') id: string) {
    await this.commandService.remove(id);

    return {
      message: 'User deleted successfully',
      data: null,
    };
  }
}
