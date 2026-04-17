import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { User } from '../domain/user';
import { CreateUserCommand } from './commands/create-user.command';
import { HashingPort } from 'src/iam/application/ports/hashing.port';
import { AuthorizationPort } from 'src/iam/application/ports/authorization.port';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { Action } from 'src/iam/domain/enums/action.enum';
import { CachePort } from 'src/core/cache/cache.port';
import { UpdateUserProfileCommand } from './commands/update-user-profile.command';

@Injectable()
export class UsersCommandService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
    private readonly authPort: AuthorizationPort,
    private readonly cachePort: CachePort,
  ) {}

  async create(command: CreateUserCommand): Promise<User> {
    const [_, __, hashedPassword] = await Promise.all([
      this.ensureEmailIsUnique(command.email),
      this.ensureUsernameIsUnique(command.username),
      this.hashService.hash(command.password),
    ]);

    const user = this.userFactory.createNew(
      command.username,
      command.email,
      hashedPassword,
    );

    await this.userRepository.save(user);
    this.invalidateUserListCache();

    return user;
  }

  async updateProfile(
    activeUser: ActiveUserData,
    command: UpdateUserProfileCommand,
  ): Promise<User> {
    this.assertPermission(activeUser, Action.Update);

    const user = await this.findUserOrThrow(command.userId);

    if (command.username) {
      await this.ensureUsernameIsUnique(command.username, user.getId());
      user.changeUsername(command.username);
    }

    await this.userRepository.save(user);
    this.invalidateUserCache(user.getId(), activeUser.id);

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findUserOrThrow(id);
    await this.userRepository.delete(id);
    this.invalidateUserListCache();
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findUserOrThrow(id);
    user.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);
  }

  async verifyUserEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Invalid verification token');

    user.verifyEmail(token);
    await this.userRepository.save(user);
  }

  async save(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  private async findUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private assertPermission(activeUser: ActiveUserData, action: Action): void {
    const isAllowed = this.authPort.checkPermission(activeUser, action, User);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
  }

  private async ensureUsernameIsUnique(
    username: string,
    excludeUserId?: string,
  ): Promise<void> {
    const existing = await this.userRepository.findByUsername(username);
    if (existing && existing.getId() !== excludeUserId) {
      throw new ConflictException('Username is already taken');
    }
  }

  private invalidateUserListCache(): void {
    this.cachePort.deleteByPattern('GET:/users*').catch(() => {});
  }

  private invalidateUserCache(userId: string, activeUserId: string): void {
    Promise.all([
      this.cachePort.deleteByPattern('GET:/users*'),
      this.cachePort.delete(`GET:/users/me:${activeUserId}`),
      this.cachePort.delete(`GET:/users/${userId}`),
    ]).catch(() => {});
  }
}
