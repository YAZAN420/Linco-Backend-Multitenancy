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
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async create(name: string): Promise<Tag> {
    return this.tagRepository.create(name);
  }

  async update(id: string, name: string): Promise<Tag> {
    await this.getById(id);
    return this.tagRepository.update(id, name);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.tagRepository.delete(id);
  }
}
