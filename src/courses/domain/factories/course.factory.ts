import { Injectable } from '@nestjs/common';
import { Course } from '../course';
import { v7 as uuidv7 } from 'uuid';
import { CreateCourseInput } from 'src/courses/application/interfaces/create-course-input.interface';

@Injectable()
export class CourseFactory {
  public createNew(input: CreateCourseInput): Course {
    const now = new Date();
    return new Course(uuidv7(), {
      title: input.title,
      visibility: input.visibility,
      price: input.price,
      authorDemoId: input.authorDemoId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
