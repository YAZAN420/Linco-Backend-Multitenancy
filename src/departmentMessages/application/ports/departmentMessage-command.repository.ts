import { DepartmentMessage } from 'src/departmentMessages/domain/departmentMessage';

export abstract class DepartmentMessageCommandRepository {
  abstract save(departmentMessage: DepartmentMessage): Promise<void>;
  abstract findById(id: string): Promise<DepartmentMessage | null>;
}
