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
import {
  InvalidResetTokenException,
  InvalidVerificationTokenException,
} from '../domain/exceptions';
import { StoragePort } from 'src/core/storage/storage.port';

@Injectable()
export class UsersCommandService {
  constructor(
    private readonly hashService: HashingPort,
    private readonly userCommandRepository: UserCommandRepository,
    private readonly userFactory: UserFactory,
    private readonly spacesService: StoragePort,
  ) {}

  async generateDemoImageUploadUrl(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return await this.spacesService.generateUploadUrl(
      fileName,
      contentType,
      true,
      'users',
    );
  }

  async create(input: CreateUserInput): Promise<User> {
    await this.ensureEmailIsUnique(input.email);
    const hashedPassword = input.password
      ? await this.hashService.hash(input.password)
      : null;

    const user = this.userFactory.createNew(
      input.firstName,
      input.lastName,
      input.email,
      hashedPassword,
      input.birthDate ?? null,
      input.imagePath,
      input.role,
      input.isEmailVerified,
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
    if (!user) throw new NotFoundException('errors.INVALID_VERIFICATION_TOKEN');

    user.security.verifyEmail(token);
    await this.userCommandRepository.save(user);
  }

  async verifyEmailWithToken(hashedToken: string): Promise<User> {
    const user =
      await this.userCommandRepository.findByVerificationToken(hashedToken);
    if (!user) throw new InvalidVerificationTokenException();
    user.security.verifyEmail(hashedToken);
    await this.userCommandRepository.save(user);
    return user;
  }
  async markEmailAsVerified(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.security.markEmailVerified();
    await this.userCommandRepository.save(user);
    return user;
  }

  async setVerificationToken(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.security.setVerificationToken(hashedToken, expiresAt);
    await this.userCommandRepository.save(user);
    return user;
  }
  async setPasswordResetToken(
    email: string,
    hashedToken: string,
    expiry: Date,
  ): Promise<User | null> {
    const user = await this.userCommandRepository.findByEmail(email);
    if (!user) return null;
    user.security.generatePasswordResetToken(hashedToken, expiry);
    await this.userCommandRepository.save(user);
    return user;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const user = await this.findById(userId);
    user.security.updatePassword(hashedPassword);
    await this.userCommandRepository.save(user);
    return user;
  }

  async disableTwoFactorAuth(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user.security.isTwoFactorEnabled) {
      throw new ConflictException(
        'Two-factor authentication is already disabled.',
      );
    }
    user.security.disableTwoFactorAuth();
    await this.userCommandRepository.save(user);
    return user;
  }

  async setTwoFactorSecret(userId: string, secret: string): Promise<User> {
    const user = await this.findById(userId);
    user.security.setTwoFactorSecret(secret);
    await this.userCommandRepository.save(user);
    return user;
  }

  async enableTwoFactorAuth(userId: string, secret: string): Promise<User> {
    const user = await this.findById(userId);
    if (user.security.isTwoFactorEnabled) {
      throw new ConflictException(
        'Two-factor authentication is already enabled.',
      );
    }
    user.security.enableTwoFactorAuth(secret);
    await this.userCommandRepository.save(user);
    return user;
  }

  async resetPassword(
    hashedToken: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = await this.userCommandRepository.findByResetToken(hashedToken);
    if (!user) throw new InvalidResetTokenException();
    user.security.resetPasswordWithToken(hashedPassword, hashedToken);
    await this.userCommandRepository.save(user);
    return user;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existing = await this.userCommandRepository.findByEmail(email);
    if (existing) throw new ConflictException('errors.EMAIL_ALREADY_EXISTS');
  }

  async findById(id: string): Promise<User> {
    const user = await this.userCommandRepository.findById(id);
    if (!user) throw new NotFoundException('errors.USER_NOT_FOUND');
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
