export class CertificationResponseDto {
  constructor(
    readonly id: string,
    readonly courseId: string,
    readonly demoMemberId: string,
    readonly score: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
