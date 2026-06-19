import { Injectable } from '@nestjs/common';
import type { DepartmentCourse as PrismaDepartmentCourse } from 'src/generated/prisma/client';
import { DepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';

@Injectable()
export class PrismaDepartmentCourseMapper {
  toDomain(raw: PrismaDepartmentCourse): DepartmentCourse {
    return new DepartmentCourse(raw.id, {
      departmentId: raw.departmentId,
      assetId: raw.assetId,
      assignedAt: raw.assignedAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(departmentCourse: DepartmentCourse): PrismaDepartmentCourse {
    return {
      id: departmentCourse.id,
      departmentId: departmentCourse.departmentId,
      assetId: departmentCourse.assetId,
      assignedAt: departmentCourse.assignedAt,
      updatedAt: departmentCourse.updatedAt,
    };
  }
}
