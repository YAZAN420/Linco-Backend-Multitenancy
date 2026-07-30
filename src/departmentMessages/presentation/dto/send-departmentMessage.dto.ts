import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

export class SendMessageDto {
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsString()
  @ValidateIf((o: SendMessageDto) => !o.fileUrl)
  @IsNotEmpty({ message: 'errors.CONTENT_OR_FILE_REQUIRED' })
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

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
