export class DepartmentCourseResponseDto {
  constructor(
    readonly id: string,
    readonly departmentId: string,
    readonly assetId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
