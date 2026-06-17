import { DepartmentCourseProps } from './interfaces/departmentCourse.props';

export class DepartmentCourse {
  constructor(
    public readonly id: string,
    private readonly props: DepartmentCourseProps,
  ) {}

  get departmentId(): string {
    return this.props.departmentId;
  }

  get assetId(): string {
    return this.props.assetId;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
