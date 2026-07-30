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

  @ValidateIf((o: SendMessageDto) => !o.fileUrl || o.content !== undefined)
  @IsString()
  @IsNotEmpty({ message: 'errors.CONTENT_OR_FILE_REQUIRED' })
  content?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ValidateIf((o: SendMessageDto) => !!o.fileUrl)
  @IsNotEmpty({ message: 'errors.FILE_NAME_REQUIRED' })
  @IsString()
  fileName?: string;

  @ValidateIf((o: SendMessageDto) => !!o.fileUrl)
  @IsNotEmpty({ message: 'errors.MIME_TYPE_REQUIRED' })
  @IsString()
  mimeType?: string;

  @ValidateIf((o: SendMessageDto) => !!o.fileUrl)
  @IsNotEmpty({ message: 'errors.FILE_SIZE_REQUIRED' })
  @IsNumber({}, { message: 'errors.FILE_SIZE_MUST_BE_NUMBER' })
  fileSize?: number;

  @IsOptional()
  @IsString()
  replyToId?: string;
}
