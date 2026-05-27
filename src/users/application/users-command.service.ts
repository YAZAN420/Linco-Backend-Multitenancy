import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { User } from '../domain/user';
import { CreateUserCommand } from './commands/create-user.command';
import { HashingPort } from 'src/iam/application/ports/hashing.port';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CachePort } from 'src/core/cache/cache.port';
import { UpdateUserProfileCommand } from './commands/update-user-profile.command';

@Injectable()
export class UsersCommandService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
    private readonly cachePort: CachePort,
  ) {}

  async create(command: CreateUserCommand): Promise<User> {
    await this.ensureEmailIsUnique(command.email);
    const hashedPassword = await this.hashService.hash(command.password);

    const user = this.userFactory.createNew(
      command.firstName,
      command.lastName,
      command.email,
      hashedPassword,
      command.birthDate,
      command.imagePath,
    );

    await this.userRepository.save(user);
    this.invalidateUserListCache();

    return user;
  }

  async updateProfile(
    activeUser: ActiveUserData,
    command: UpdateUserProfileCommand,
  ): Promise<User> {
    const user = await this.findUserOrThrow(command.userId);

    if (command.firstName !== undefined)
      user.changeFirstName(command.firstName);
    if (command.lastName !== undefined) user.changeLastName(command.lastName);
    if (command.birthDate !== undefined)
      user.changeBirthDate(command.birthDate);
    if (command.imagePath !== undefined)
      user.changeImagePath(command.imagePath ?? '');

    await this.userRepository.save(user);
    this.invalidateUserCache(user.id, activeUser.id);

    return user;
  }

  async remove(activeUser: ActiveUserData, id: string): Promise<void> {
    await this.findUserOrThrow(id);
    await this.userRepository.delete(id);
    this.invalidateUserListCache();
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findUserOrThrow(id);
    user.security.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);
  }

  async verifyUserEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Invalid verification token');

    user.security.verifyEmail(token);
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

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
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
