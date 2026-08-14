export class CourseDashboardStatsResponseDto {
  constructor(
    readonly totalCourses: number,
    readonly publishedCourses: number,
    readonly draftCourses: number,
    readonly totalEnrollments: number,
    readonly publicCourses: number,
    readonly privateCourses: number,
  ) {}
}
