import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseCommandRepository } from './ports/course-command.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { Course } from '../domain/course';

import { CreateCourseInput } from './interfaces/create-course-input.interface';
import { UpdateCourseInput } from './interfaces/update-course-input.interface';
import { Title } from '../domain/value-objects/title.vo';
import { Price } from '../domain/value-objects/price.vo';

@Injectable()
export class CoursesCommandService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly courseFactory: CourseFactory,
  ) {}

  async create(input: CreateCourseInput): Promise<Course> {
    const course = this.courseFactory.createNew(
      input.title,
      input.visibility,
      input.price,
      input.authorDemoId,
    );
    await this.courseCommandRepository.save(course);
    return course;
  }

  async update(id: string, input: UpdateCourseInput): Promise<Course> {
    const course = await this.findById(id);
    if (input.title) {
      const titleVo = Title.create(input.title);
      course.updateTitle(titleVo);
    }
    if (input.price) {
      const priceVo = Price.create(input.price);
      course.updatePrice(priceVo);
    }
    course.updateVisibility(input.visibility ?? course.visibility);
    await this.courseCommandRepository.save(course);
    return course;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.courseCommandRepository.delete(id);
  }

  async save(course: Course): Promise<void> {
    await this.courseCommandRepository.save(course);
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('course not found');
    return course;
  }
}
