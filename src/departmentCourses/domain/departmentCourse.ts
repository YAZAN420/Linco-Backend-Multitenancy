import { DepartmentCourseProps } from './interfaces/departmentCourse.props';

export class DepartmentCourse {
  constructor(
    public readonly id: string,
    private readonly props: DepartmentCourseProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
