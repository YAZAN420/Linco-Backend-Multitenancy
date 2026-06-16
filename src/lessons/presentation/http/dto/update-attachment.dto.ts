import { IsOptional, IsString } from 'class-validator';
import { UpdateAttachmentInput } from 'src/lessons/application/interfaces/update-attachment-input.interface';

export class UpdateAttachmentDto implements UpdateAttachmentInput {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  path?: string;
  @IsString()
  @IsOptional()
  mimeType?: string;
}
