import { Injectable } from '@nestjs/common';
import { DepartmentCourse } from '../departmentCourse';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DepartmentCourseFactory {
  public createNew(): DepartmentCourse {
    const now = new Date();
    return new DepartmentCourse(uuidv7(),{ 
      createdAt: now,
      updatedAt: now,
    });
  }
}
