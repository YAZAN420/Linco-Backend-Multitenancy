import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { TagRepository } from '../../application/ports/tag.repository';
import { Tag } from '../../domain/tag';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    return tags.map((t) => new Tag(t.id, t.name));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    return tag ? new Tag(tag.id, tag.name) : null;
  }

  async create(name: string): Promise<Tag> {
    const tag = await this.prisma.tag.upsert({
      where: { name },
      update: { name },
      create: {
        id: uuidv7(),
        name,
      },
    });

    return new Tag(tag.id, tag.name);
  }

  async existsByIds(ids: string[]): Promise<boolean> {
    if (ids.length === 0) {
      return true;
    }

    const count = await this.prisma.tag.count({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return count === ids.length;
  }

  async update(id: string, name: string): Promise<Tag> {
    const tag = await this.prisma.tag.update({
      where: { id },
      data: { name },
    });
    return new Tag(tag.id, tag.name);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }
}
