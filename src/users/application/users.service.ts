import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { User } from '../domain/user';
import { HashingPort } from 'src/iam/application/ports/hashing.port';
import { CachePort } from 'src/core/cache/cache.port';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { FindUsersDto } from '../presentation/http/dto/filters/find-users.dto';
import { FindUsersCursorDto } from '../presentation/http/dto/filters/find-users-cursor.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { CreateUserDto } from '../presentation/http/dto/create-user.dto';
import { UpdateUserDto } from '../presentation/http/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
    private readonly cachePort: CachePort,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    await this.ensureEmailIsUnique(dto.email);
    const hashedPassword = await this.hashService.hash(dto.password);

    const user = this.userFactory.createNew(
      dto.firstName,
      dto.lastName,
      dto.email,
      hashedPassword,
      dto.birthDate,
      dto.imagePath,
    );

    await this.userRepository.save(user);
    this.invalidateUserListCache();

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findUserOrThrow(id);

    if (dto.firstName !== undefined) user.changeFirstName(dto.firstName);
    if (dto.lastName !== undefined) user.changeLastName(dto.lastName);
    if (dto.birthDate !== undefined) user.changeBirthDate(dto.birthDate);
    if (dto.imagePath !== undefined) user.changeImagePath(dto.imagePath ?? '');

    await this.userRepository.save(user);
    this.invalidateUserCache(user.id, id);

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

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(pageOptionsDto: FindUsersDto): Promise<PageDto<User>> {
    return this.userRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindUsersCursorDto,
  ): Promise<CursorPageDto<User>> {
    return this.userRepository.findAllCursor(options);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findByVerificationToken(token);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }
}
