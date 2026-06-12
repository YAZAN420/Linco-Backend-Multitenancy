import { Injectable, NotFoundException } from '@nestjs/common';

import { SectionFactory } from '../domain/factories/section.factory';
import { CreateSectionInput } from './interfaces/create-section-input.interface';
import { Section } from '../domain/section';
import { UpdateSectionInput } from './interfaces/update-section-input.interface';
import { CourseCommandRepository } from './ports/course-command.repository';
import { Course } from '../domain/course';

@Injectable()
export class SectionsCommandService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly sectionFactory: SectionFactory,
  ) {}

  async create(courseId: string, input: CreateSectionInput): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = this.sectionFactory.createNew(courseId, input);

    course.addSection(section);

    await this.courseCommandRepository.save(course);
    return section;
  }

  async update(
    courseId: string,
    sectionId: string,
    input: UpdateSectionInput,
  ): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    course.updateSection(sectionId, input.title, input.order);

    await this.courseCommandRepository.save(course);

    return course.sections.find((s) => s.id === sectionId)!;
  }

  async remove(courseId: string, sectionId: string): Promise<void> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    course.removeSection(sectionId);
    await this.courseCommandRepository.save(course);
  }

  async save(course: Course): Promise<void> {
    await this.courseCommandRepository.save(course);
  }
}
