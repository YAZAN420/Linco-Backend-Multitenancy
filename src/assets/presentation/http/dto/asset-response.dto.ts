export class AssetResponseDto {
  constructor(
    readonly id: string,
    readonly demoId: string,
    readonly courseId: string,
    readonly accessMethod: string,
    readonly acquiredAt: Date,
    readonly updatedAt: Date,
  ) {}
}
