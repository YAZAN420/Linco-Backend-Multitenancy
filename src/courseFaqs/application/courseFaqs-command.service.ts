import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseFaqCommandRepository } from './ports/courseFaq-command.repository';
import { CourseFaqFactory } from '../domain/factories/courseFaq.factory';
import { CourseFaq } from '../domain/courseFaq';

import { CreateCourseFaqInput } from './interfaces/create-courseFaq-input.interface';

import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';

@Injectable()
export class CourseFaqsCommandService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly courseFaqCommandRepository: CourseFaqCommandRepository,
    private readonly courseFaqFactory: CourseFaqFactory,
  ) {}

  async create(
    courseId: string,
    input: CreateCourseFaqInput,
  ): Promise<CourseFaq> {
    const course = await this.courseCommandRepository.findById(courseId);

    if (!course) throw new NotFoundException('Course Not Found');

    const courseFaq = this.courseFaqFactory.createNew(
      input.question,
      input.answer,
      courseId,
    );
    await this.courseFaqCommandRepository.save(courseFaq);
    return courseFaq;
  }

  async remove(courseId: string, courseFaqId: string): Promise<void> {
    const course = await this.courseCommandRepository.findById(courseId);

    if (!course) throw new NotFoundException('Course Not Found');

    await this.findById(courseFaqId);
    await this.courseFaqCommandRepository.delete(courseFaqId);
  }

  async findById(courseFaqId: string): Promise<CourseFaq> {
    const courseFaq =
      await this.courseFaqCommandRepository.findById(courseFaqId);
    if (!courseFaq) throw new NotFoundException('courseFaq not found');
    return courseFaq;
  }
}
