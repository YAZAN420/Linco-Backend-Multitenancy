import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

export class SendMessageDto {
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
