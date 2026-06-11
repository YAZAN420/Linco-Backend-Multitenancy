import { Injectable, NotFoundException } from '@nestjs/common';
import { SectionCommandRepository } from './ports/section-command.repository';
import { SectionFactory } from '../domain/factories/section.factory';
import { CreateSectionInput } from './interfaces/create-section-input.interface';
import { Section } from '../domain/section';
import { UpdateSectionInput } from './interfaces/update-section-input.interface';
import { CourseCommandRepository } from './ports/course-command.repository';

@Injectable()
export class SectionsCommandService {
  constructor(
    private readonly sectionCommandRepository: SectionCommandRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly sectionFactory: SectionFactory,
  ) {}

  async create(courseId: string, input: CreateSectionInput): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = this.sectionFactory.createNew(courseId, input);
    await this.sectionCommandRepository.save(section);
    return section;
  }

  async update(
    courseId: string,
    sectionId: string,
    input: UpdateSectionInput,
  ): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = await this.findById(courseId, sectionId);
    section.updateTitle(input.title ?? section.title);
    section.updateOrder(input.order ?? section.order);
    section.updateCourseId(courseId ?? section.courseId);
    await this.sectionCommandRepository.save(section);
    return section;
  }

  async remove(courseId: string, sectionId: string): Promise<void> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    await this.findById(courseId, sectionId);
    await this.sectionCommandRepository.delete(sectionId);
  }

  async save(section: Section): Promise<void> {
    await this.sectionCommandRepository.save(section);
  }

  async findById(courseId: string, sectionId: string): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = await this.sectionCommandRepository.findById(
      courseId,
      sectionId,
    );
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }
}
