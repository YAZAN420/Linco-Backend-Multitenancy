import { Injectable } from '@nestjs/common';
import type { DepartmentCourse as PrismaDepartmentCourse} from 'src/generated/prisma/client';
import { DepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';


@Injectable()
export class PrismaDepartmentCourseMapper {
  toDomain(raw: PrismaDepartmentCourse): DepartmentCourse {
    return new DepartmentCourse(raw.id, {
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(departmentCourse: DepartmentCourse): PrismaDepartmentCourse {
    return {
      id: departmentCourse.id,
      createdAt: departmentCourse.createdAt,
      updatedAt: departmentCourse.updatedAt,
    };
  }
}