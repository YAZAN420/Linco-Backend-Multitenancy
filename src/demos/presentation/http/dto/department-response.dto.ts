export class DepartmentResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly managerId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
