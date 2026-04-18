import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserMapper } from '../../../shared/user.mapper';
import { InMemoryUserEntity } from '../entities/user.entity';
import {
  CursorPageDto,
  CursorPageMetaDto,
  CursorPageOptionsDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, InMemoryUserEntity>();

  constructor(private readonly mapper: UserMapper) {}

  async findAll(options: PageOptionsDto): Promise<PageDto<User>> {
    const entities = Array.from(this.store.values());
    const domainUsers = entities.map((entity) => this.mapper.toDomain(entity));
    const startIndex = options.skip;
    const endIndex = startIndex + options.take;
    const paginatedItems = domainUsers.slice(startIndex, endIndex);
    const itemCount = domainUsers.length;
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: options,
    });
    return Promise.resolve(new PageDto(paginatedItems, pageMetaDto));
  }

  async findAllCursor(
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<User>> {
    const { cursor, take } = options;

    const entities = Array.from(this.store.values());
    const domainUsers = entities.map((entity) => this.mapper.toDomain(entity));

    domainUsers.sort((a, b) => b.getId().localeCompare(a.getId()));
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = domainUsers.findIndex((u) => u.getId() === cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }
    const paginatedItems = domainUsers.slice(startIndex, startIndex + take + 1);
    const hasNextPage = paginatedItems.length > take;
    if (hasNextPage) {
      paginatedItems.pop();
    }
    const endCursor =
      paginatedItems.length > 0
        ? paginatedItems[paginatedItems.length - 1].getId()
        : null;
    const meta = new CursorPageMetaDto(hasNextPage, endCursor);
    return Promise.resolve(new CursorPageDto(paginatedItems, meta));
  }

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    this.store.set(user.getId(), data);
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
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
