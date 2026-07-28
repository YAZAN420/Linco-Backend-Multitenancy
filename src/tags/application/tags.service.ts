import { Injectable, NotFoundException } from '@nestjs/common';
import { TagRepository } from './ports/tag.repository';
import { Tag } from '../domain/tag';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAll(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }

  async getById(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) throw new NotFoundException('errors.TAG_NOT_FOUND');
    return tag;
  }

  async create(name: string): Promise<Tag> {
    const tag = await this.tagRepository.create(name);
    return tag;
  }

  async update(id: string, name: string): Promise<Tag> {
    await this.getById(id);
    const tag = await this.tagRepository.update(id, name);
    return tag;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    const tag = await this.tagRepository.delete(id);
    return tag;
  }
}
