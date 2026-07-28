export class DepartmentMessageResponseDto {
  constructor(
    public readonly id: string,
    public readonly departmentId: string,
    public readonly senderId: string,
    public readonly type: string,
    public readonly content: string | undefined,
    public readonly blobName: string | undefined,
    public readonly fileName: string | undefined,
    public readonly mimeType: string | undefined,
    public readonly fileSize: number | undefined,
    public readonly replyToId: string | undefined,
    public readonly isEdited: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly sender?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      imagePath: string | null;
    },
    public readonly replyTo?: {
      id: string;
      content: string | null;
      type: string;
    },
  ) {}
}
