import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { CreateDepartmentMessageInput } from 'src/departmentMessages/application/interfaces/create-departmentMessage-input.interface';
import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

export class CreateDepartmentMessageDto implements CreateDepartmentMessageInput {
  @IsString()
  @IsNotEmpty()
  departmentId!: string;

  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  blobName?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsString()
  replyToId?: string;
}
