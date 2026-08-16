export class DepartmentResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly managerId: string,
    readonly description: string,
    readonly isGroup: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly courseCount?: number,
    readonly membersCount?: number,
    readonly isJoind?: boolean,
  ) {}
}
