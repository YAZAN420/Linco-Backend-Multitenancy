import { DepartmentProps } from './interfaces/department.props';
import { Name } from './value-objects/name.vo';

export class Department {
  constructor(
    public readonly id: string,
    private props: DepartmentProps,
  ) {}

  get name(): string {
    return this.props.name.value;
  }

  get demoId(): string {
    return this.props.demoId;
  }
  get nameVo(): Name {
    return this.props.name;
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

  updateName(newName: Name): void {
    if (this.props.name.equals(newName)) return;
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
