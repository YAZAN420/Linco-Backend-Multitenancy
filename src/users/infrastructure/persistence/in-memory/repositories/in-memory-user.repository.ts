import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserMapper } from '../../../shared/user.mapper';
import { InMemoryUserEntity } from '../entities/user.entity';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, InMemoryUserEntity>();

  constructor(private readonly mapper: UserMapper) {}

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    this.store.set(user.getId(), data);
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(
      Array.from(this.store.values()).map((e) => this.mapper.toDomain(e)),
    );
  }

  async findById(id: string): Promise<User | null> {
    const entity = this.store.get(id);
    return entity ? Promise.resolve(this.mapper.toDomain(entity)) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.findOneBy((e) => e.email === email));
  }

  async findByUsername(username: string): Promise<User | null> {
    return Promise.resolve(this.findOneBy((e) => e.username === username));
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return Promise.resolve(
      this.findOneBy((e) => e.emailVerificationToken === token),
    );
  }

  async findByResetToken(token: string): Promise<User | null> {
    return Promise.resolve(
      this.findOneBy((e) => e.passwordResetToken === token),
    );
  }

  private findOneBy(
    predicate: (entity: InMemoryUserEntity) => boolean,
  ): User | null {
    for (const entity of this.store.values()) {
      if (predicate(entity)) {
        return this.mapper.toDomain(entity);
      }
    }
    return null;
  }
}
