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
}
