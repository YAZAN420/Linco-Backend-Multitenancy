import {
  DemoMemberRole,
  DepartmentMemberRole,
} from 'src/generated/prisma/client';

export abstract class AuthorizationQueryRepository {
  abstract findDemoRole(
    userId: string,
    demoId: string,
  ): Promise<DemoMemberRole | null>;
  abstract findDepartmentRole(
    userId: string,
    demoId: string,
    departmentId: string,
  ): Promise<DepartmentMemberRole | null>;
}
