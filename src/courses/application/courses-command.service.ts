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
@Injectable()
export class CoursesCommandService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly courseFactory: CourseFactory,
  ) {}

  async create(input: CreateCourseInput): Promise<Course> {
    const course = this.courseFactory.createNew(
      input.title,
      input.visibility,
      input.authorDemoId,
      input.price,
    );

    await this.courseCommandRepository.save(course);

    this.eventEmitter.emit(
      'course.created',
      new CourseCreatedEvent(input.authorDemoId, course.id),
    );

    return course;
  }

  async update(courseId: string, input: UpdateCourseInput): Promise<Course> {
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

  async remove(courseId: string): Promise<void> {
    await this.findById(courseId);
    await this.courseCommandRepository.delete(courseId);
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('course not found');
    return course;
  }
}
