import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { User } from '../domain/user';
import { HashingPort } from 'src/iam/application/ports/hashing.port';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { FindUsersDto } from '../presentation/http/dto/filters/find-users.dto';
import { FindUsersCursorDto } from '../presentation/http/dto/filters/find-users-cursor.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { CreateUserInput } from './interfaces/create-user-input.interface';
import { UpdateUserInput } from './interfaces/update-user-input.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    await this.ensureEmailIsUnique(input.email);
    const hashedPassword = await this.hashService.hash(input.password);

    const user = this.userFactory.createNew(
      input.firstName,
      input.lastName,
      input.email,
      hashedPassword,
      input.birthDate,
      input.imagePath,
    );

    await this.userRepository.save(user);

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findUserOrThrow(id);

    if (input.firstName !== undefined) user.changeFirstName(input.firstName);
    if (input.lastName !== undefined) user.changeLastName(input.lastName);
    if (input.birthDate !== undefined) user.changeBirthDate(input.birthDate);
    if (input.imagePath !== undefined)
      user.changeImagePath(input.imagePath ?? '');

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findUserOrThrow(id);
    await this.userRepository.delete(id);
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
