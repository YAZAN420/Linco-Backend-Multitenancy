import { DepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';

export abstract class DepartmentCourseCommandRepository {
  abstract save(departmentCourse: DepartmentCourse): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<DepartmentCourse | null>;
}
