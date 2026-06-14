import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCommandRepository } from './ports/user-command.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { User } from '../domain/user';
import { HashingPort } from 'src/iam/application/ports/hashing.port';

import { CreateUserInput } from './interfaces/create-user-input.interface';
import { UpdateUserInput } from './interfaces/update-user-input.interface';

@Injectable()
export class UsersCommandService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userCommandRepository: UserCommandRepository,
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

    await this.userCommandRepository.save(user);

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    if (input.firstName) user.updateFirstName(input.firstName);
    if (input.lastName) user.updateLastName(input.lastName);
    if (input.birthDate) user.updateBirthDate(input.birthDate);
    if (input.imagePath) user.updateImagePath(input.imagePath);

    await this.userCommandRepository.save(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userCommandRepository.delete(id);
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findById(id);
    user.security.updateRefreshToken(refreshToken);
    await this.userCommandRepository.save(user);
  }

  async verifyUserEmail(token: string): Promise<void> {
    const user =
      await this.userCommandRepository.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Invalid verification token');

    user.security.verifyEmail(token);
    await this.userCommandRepository.save(user);
  }

  async save(user: User): Promise<void> {
    await this.userCommandRepository.save(user);
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existing = await this.userCommandRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
  }

  async findById(id: string): Promise<User> {
    const user = await this.userCommandRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userCommandRepository.findByEmail(email);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userCommandRepository.findByVerificationToken(token);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userCommandRepository.findByResetToken(token);
  }
}
