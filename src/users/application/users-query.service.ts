import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../domain/user';
import { UserRepository } from './ports/user.repository';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';
import { GetUserByEmailQuery } from './queries/get-user-by-email.query';
import {
  CursorPageDto,
  CursorPageOptionsDto,
  PageDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

@Injectable()
export class UsersQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return this.userRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<User>> {
    return this.userRepository.findAllCursor(options);
  }

  async findByEmail(query: GetUserByEmailQuery): Promise<User | null> {
    return this.userRepository.findByEmail(query.email);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findByVerificationToken(token);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }
}
