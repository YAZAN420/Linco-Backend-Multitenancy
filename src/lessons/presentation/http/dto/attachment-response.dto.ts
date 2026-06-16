export class AttachmentResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly path: string,
    readonly mimeType: string | null,
    readonly lessonId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
