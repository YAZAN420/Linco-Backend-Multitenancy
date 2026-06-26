import { DomainException } from 'src/common/exceptions/domain.exception';
import { Department } from './department';
import { DemoProps } from './interfaces/demo.props';
import { Name } from './value-objects/name.vo';

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

  get imagePath(): string {
    return this.props.imagePath;
  }

  get description(): string {
    return this.props.description;
  }

  get name(): string {
    return this.props.name.value;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get departments(): Department[] {
    return this.props.departments ?? [];
  }

  updateName(newName: Name): void {
    if (this.props.name.equals(newName)) return;
    this.props.name = newName;
    this.touch();
  }

  updateImagePath(newImagePath: string): void {
    if (this.props.imagePath === newImagePath) return;
    this.props.imagePath = newImagePath;
    this.touch();
  }

  updateDescription(newDescription: string): void {
    if (this.props.description === newDescription) return;
    this.props.description = newDescription;
    this.touch();
  }

  addDepartment(department: Department): void {
    if (!department) {
      throw new DomainException('Department cannot be null or undefined');
    }

    const exists = this.departments.some(
      (d) => d.name.toLowerCase() === department.name.toLowerCase(),
    );
    if (exists) {
      throw new DomainException(
        `Department "${department.name}" already exists`,
      );
    }

    this.props.departments.push(department);
    this.touch();
  }

  removeDepartment(departmentId: string): void {
    if (!this.hasDepartment(departmentId)) {
      throw new DomainException('Department not found in this demo');
    }

    const index = this.props.departments.findIndex(
      (d) => d.id === departmentId,
    );
    if (index !== -1) {
      this.props.departments.splice(index, 1);
      this.touch();
    }
  }

  renameDepartment(departmentId: string, newName: Name): void {
    const department = this.getDepartmentStrict(departmentId);

    if (department.nameVo.equals(newName)) return;

    const nameExists = this.departments.some(
      (d) => d.id !== departmentId && d.nameVo.equals(newName),
    );

    if (nameExists) {
      throw new DomainException(
        `Department "${newName.value}" already exists in this demo`,
      );
    }

    department.updateName(newName);
    this.touch();
  }

  updateDepartmentDescription(
    departmentId: string,
    newDescription: string,
  ): void {
    const department = this.getDepartmentStrict(departmentId);
    department.updateDescription(newDescription);
    this.touch();
  }

  reassignDepartmentManager(departmentId: string, newManagerId: string): void {
    const department = this.getDepartmentStrict(departmentId);
    department.updateManager(newManagerId);
    this.touch();
  }

  hasDepartment(departmentId: string): boolean {
    return this.departments.some((d) => d.id === departmentId);
  }

  verifyCanAddMember(currentCount: number): void {
    if (currentCount >= Demo.MAX_MEMBERS) {
      throw new DomainException(
        `Demo cannot exceed ${Demo.MAX_MEMBERS} members`,
      );
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private getDepartmentStrict(departmentId: string): Department {
    const department = this.departments.find((d) => d.id === departmentId);
    if (!department) {
      throw new DomainException('Department not found in this demo');
    }
    return department;
  }
}
