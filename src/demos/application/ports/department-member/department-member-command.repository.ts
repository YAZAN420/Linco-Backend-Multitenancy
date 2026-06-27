import { DepartmentMember } from 'src/demos/domain/department-member';

export abstract class DepartmentMemberCommandRepository {
  abstract save(member: DepartmentMember): Promise<void>;
  abstract findById(id: string): Promise<DepartmentMember | null>;
  abstract delete(id: string): Promise<void>;
  abstract findByDepartmentAndDemoMember(
    departmentId: string,
    demoMemberId: string,
  ): Promise<DepartmentMember | null>;
  abstract countByDepartment(departmentId: string): Promise<number>;
}
