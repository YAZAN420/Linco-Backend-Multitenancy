export class CertificationResponseDto {
  constructor(
    readonly id: string,
    readonly courseId: string,
    readonly demoName: string,
    readonly score: number,
    readonly userName: string,
    readonly logoImagePath: string,
    readonly courseName: string,
    readonly signature: string,
    readonly issuedAt: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
