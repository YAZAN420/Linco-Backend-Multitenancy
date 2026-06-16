import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseCommandRepository } from './ports/course-command.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { Course } from '../domain/course';

import { CreateCourseInput } from './interfaces/create-course-input.interface';
import { UpdateCourseInput } from './interfaces/update-course-input.interface';
import { Title } from '../domain/value-objects/title.vo';
import { Price } from '../domain/value-objects/price.vo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CourseCreatedEvent } from 'src/common/events/course-created.event';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';

@Injectable()
export class CoursesCommandService {
  constructor(
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly courseFactory: CourseFactory,
  ) {}

  async create(demoId: string, input: CreateCourseInput): Promise<Course> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }

    const course = this.courseFactory.createNew(
      input.title,
      input.visibility,
      demoId,
      input.price,
    );

    await this.courseCommandRepository.save(course);

    this.eventEmitter.emit(
      'course.created',
      new CourseCreatedEvent(demoId, course.id),
    );

    return course;
  }

  async update(
    demoId: string,
    courseId: string,
    input: UpdateCourseInput,
  ): Promise<Course> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }

    const course = await this.findById(courseId);
    if (input.title !== undefined && input.title !== null) {
      const titleVo = Title.create(input.title);
      course.updateTitle(titleVo);
    }

    if (input.price !== undefined) {
      const priceVo = Price.create(input.price);
      course.updatePrice(priceVo);
    }

    if (input.visibility !== undefined && input.visibility !== null) {
      course.updateVisibility(input.visibility);
    }
    await this.courseCommandRepository.save(course);
    return course;
  }

  async remove(demoId: string, courseId: string): Promise<void> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    await this.findById(courseId);
    await this.courseCommandRepository.delete(courseId);
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('course not found');
    return course;
  }
}
