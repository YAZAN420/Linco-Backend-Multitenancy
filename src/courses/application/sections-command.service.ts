import { Injectable, NotFoundException } from '@nestjs/common';
import { SectionCommandRepository } from './ports/section-command.repository';
import { SectionFactory } from '../domain/factories/section.factory';
import { CreateSectionInput } from './interfaces/create-section-input.interface';
import { Section } from '../domain/section';
import { UpdateSectionInput } from './interfaces/update-section-input.interface';

@Injectable()
export class SectionsCommandService {
  constructor(
    private readonly sectionCommandRepository: SectionCommandRepository,
    private readonly sectionFactory: SectionFactory,
  ) {}

  async create(input: CreateSectionInput): Promise<Section> {
    const section = this.sectionFactory.createNew(input);
    await this.sectionCommandRepository.save(section);
    return section;
  }

  async update(id: string, input: UpdateSectionInput): Promise<Section> {
    const section = await this.findById(id);
    section.updateTitle(input.title ?? section.title);
    section.updateOrder(input.order ?? section.order);
    section.updateCourseId(input.courseId ?? section.courseId);
    await this.sectionCommandRepository.save(section);
    return section;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.sectionCommandRepository.delete(id);
  }

  async save(section: Section): Promise<void> {
    await this.sectionCommandRepository.save(section);
  }

  async findById(id: string): Promise<Section> {
    const section = await this.sectionCommandRepository.findById(id);
    if (!section) throw new NotFoundException('section not found');
    return section;
  }
}
