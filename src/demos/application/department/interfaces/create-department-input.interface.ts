export interface CreateDepartmentInput {
  name: string;
  managerId: string;
  description: string;
  isGroup?: boolean;
}
