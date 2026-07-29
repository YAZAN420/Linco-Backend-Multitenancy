import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

export class DepartmentMessageResponseDto {
  constructor(
    public readonly id: string,
    public readonly departmentId: string,
    public readonly type: MessageType,
    public readonly content: string | undefined,
    public readonly isEdited: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly sender: {
      id: string;
      firstName: string;
      lastName: string;
      imagePath: string;
    },

    public readonly attachment?: {
      fileUrl: string;
      fileName: string;
      mimeType: string;
      fileSize: number;
    },

    public readonly replyTo?: {
      id: string;
      content: string | null;
      type: string;
    },
  ) {}
}
