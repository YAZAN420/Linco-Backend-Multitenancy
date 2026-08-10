export class CertificationResponseDto {
  constructor(
    readonly id: string,
    readonly courseId: string,
    readonly demoMemberId: string,
    readonly score: number,
    readonly demoName: string,
    readonly courseName: string,
    readonly signature: string,
    readonly issuedAt: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
