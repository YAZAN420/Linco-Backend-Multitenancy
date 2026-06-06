import { UpdateDemoInput } from '../application/interfaces/update-demo-input.interface';
import { UpdateDepartmentInput } from '../application/interfaces/update-department-input.interface';
import { Department } from './department';
import { DomainConflictException } from './exceptions/conflict.exception';
import { DomainNotFoundException } from './exceptions/not-found.exception';
import { DomainValidationException } from './exceptions/validation.exception';
import { DemoProps } from './interfaces/demo.props';

export class Demo {
  private static readonly MAX_MEMBERS = 50;
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

  update(data: UpdateDemoInput): void {
    let isModified = false;

    if (data.name !== undefined && data.name !== this.props.name) {
      if (data.name.trim().length === 0) {
        throw new DomainValidationException('Demo name cannot be empty');
      }
      this.props.name = data.name;
      isModified = true;
    }

    if (isModified) {
      this.props.updatedAt = new Date();
    }
  }

  addDepartment(department: Department): void {
    if (!department) {
      throw new DomainValidationException(
        'Department cannot be null or undefined',
      );
    }

    const exists = this.departments.some(
      (d) => d.name.toLowerCase() === department.name.toLowerCase(),
    );
    if (exists) {
      throw new DomainConflictException(
        `Department "${department.name}" already exists`,
      );
    }

    this.props.departments = [...this.props.departments, department];
    this.props.updatedAt = new Date();
  }

  removeDepartment(departmentId: string): void {
    if (!this.hasDepartment(departmentId)) {
      throw new DomainNotFoundException('Department not found in this demo');
    }

    this.props.departments = this.departments.filter(
      (d) => d.id !== departmentId,
    );
    this.props.updatedAt = new Date();
  }

  updateDepartment(departmentId: string, data: UpdateDepartmentInput): void {
    const department = this.departments.find((d) => d.id === departmentId);
    if (!department) {
      throw new DomainNotFoundException('Department not found in this demo');
    }

    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new DomainValidationException('Department name cannot be empty');
      }

      const isNameChanged =
        data.name.toLowerCase() !== department.name.toLowerCase();
      if (isNameChanged) {
        const nameExists = this.departments.some(
          (d) =>
            d.id !== departmentId &&
            d.name.toLowerCase() === data.name.toLowerCase(),
        );
        if (nameExists) {
          throw new DomainConflictException(
            `Department "${data.name}" already exists in this demo`,
          );
        }
      }
    }

    department.update(data);
    this.props.updatedAt = new Date();
  }

  hasDepartment(departmentId: string): boolean {
    return this.departments.some((d) => d.id === departmentId);
  }

  setDepartments(departments: Department[]): void {
    this.props.departments = departments;
  }

  verifyCanAddMember(currentCount: number): void {
    if (currentCount >= Demo.MAX_MEMBERS) {
      throw new DomainValidationException(
        `Demo cannot exceed ${Demo.MAX_MEMBERS} members`,
      );
    }
  }
}
