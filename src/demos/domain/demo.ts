import { Department } from './department';
import { DemoProps } from './interfaces/demo.props';

export class Demo {
  constructor(
    public readonly id: string,
    private readonly props: DemoProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get name(): string {
    return this.props.name;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get departments(): Department[] {
    return this.props.departments ?? [];
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  delete(): void {
    if (this.deletedAt) {
      throw new Error('Demo is already deleted');
    }
    this.props.deletedAt = new Date();
  }

  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Demo name cannot be empty');
    }
    this.props.name = newName.trim();
    this.props.updatedAt = new Date();
  }

  addDepartment(department: Department): void {
    if (!department) {
      throw new Error('Department cannot be null or undefined');
    }
    const exists = this.departments.some(
      (d) => d.name.toLowerCase() === department.name.toLowerCase(),
    );
    if (exists) {
      throw new Error(`Department "${department.name}" already exists`);
    }
    this.props.departments = [...this.props.departments, department];
    this.props.updatedAt = new Date();
  }

  removeDepartment(departmentId: string): void {
    const exists = this.hasDepartment(departmentId);

    if (!exists) {
      throw new Error('Department not found in this demo');
    }

    this.props.departments = this.departments.filter(
      (d) => d.id !== departmentId,
    );
    this.props.updatedAt = new Date();
  }

  hasDepartment(departmentId: string): boolean {
    return this.departments.some((d) => d.id === departmentId);
  }

  setDepartments(departments: Department[]): void {
    this.props.departments = departments;
  }
}
