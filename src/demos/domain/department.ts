import { UpdateDepartmentInput } from '../application/interfaces/update-department-input.interface';
import { DepartmentProps } from './interfaces/department.props';

export class Department {
  constructor(
    public readonly id: string,
    private props: DepartmentProps,
  ) {}

  get name(): string {
    return this.props.name;
  }

  get demoId(): string {
    return this.props.demoId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get managerId(): string {
    return this.props.managerId;
  }

  update(data: UpdateDepartmentInput): void {
    let isModified = false;

    if (data.name !== undefined && data.name !== this.props.name) {
      this.props.name = data.name;
      isModified = true;
    }

    if (
      data.managerId !== undefined &&
      data.managerId !== this.props.managerId
    ) {
      this.props.managerId = data.managerId;
      isModified = true;
    }

    if (isModified) {
      this.props.updatedAt = new Date();
    }
  }
}
