import { DepartmentResponseDto } from './department-response.dto';

export class DemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly departments?: DepartmentResponseDto[],
  ) {}
}
