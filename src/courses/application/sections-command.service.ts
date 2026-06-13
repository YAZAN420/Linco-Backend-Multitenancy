import { Injectable, NotFoundException } from '@nestjs/common';

import { SectionFactory } from '../domain/factories/section.factory';
import { CreateSectionInput } from './interfaces/create-section-input.interface';
import { Section } from '../domain/section';
import { UpdateSectionInput } from './interfaces/update-section-input.interface';
import { CourseCommandRepository } from './ports/course-command.repository';
import { Title } from '../domain/value-objects/title.vo';
import { SectionOrder } from '../domain/value-objects/section-order.vo';
import { Course } from '../domain/course';

@Injectable()
export class SectionsCommandService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly sectionFactory: SectionFactory,
  ) {}

  async create(courseId: string, input: CreateSectionInput): Promise<Section> {
    const course = await this.findCourseById(courseId);

    const section = this.sectionFactory.createNew(
      courseId,
      input.title,
      input.order,
    );

    course.addSection(section);

    await this.courseCommandRepository.save(course);
    return section;
  }

  async update(
    courseId: string,
    sectionId: string,
    input: UpdateSectionInput,
  ): Promise<Section> {
    const course = await this.findCourseById(courseId);

    const titleVo = input.title ? Title.create(input.title) : null;
    const sectionOrderVo = input.order
      ? SectionOrder.create(input.order)
      : null;

    course.updateSection(sectionId, titleVo, sectionOrderVo);

    await this.courseCommandRepository.save(course);

    return course.sections.find((s) => s.id === sectionId)!;
  }

  async remove(courseId: string, sectionId: string): Promise<void> {
    const course = await this.findCourseById(courseId);
    course.removeSection(sectionId);
    await this.courseCommandRepository.save(course);
  }

  private async findCourseById(courseId: string): Promise<Course> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('course not found');
    return course;
  }
}
