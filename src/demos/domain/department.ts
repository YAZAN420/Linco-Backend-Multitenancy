import { DomainValidationException } from './exceptions/validation.exception';
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

  updateName(newName: string): void {
    if (newName === this.props.name) return;
    if (newName.trim().length === 0) {
      throw new DomainValidationException('Department name cannot be empty');
    }
    this.props.name = newName;
    this.touch();
  }

  updateManager(newManagerId: string): void {
    if (newManagerId === this.props.managerId) return;
    this.props.managerId = newManagerId;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
