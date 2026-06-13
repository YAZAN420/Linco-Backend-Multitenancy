import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAttachmentInput } from 'src/lessons/application/interfaces/create-attachment-input.interface';

export class CreateAttachmentDto implements CreateAttachmentInput {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  path!: string;
  @IsString()
  @IsOptional()
  mimeType?: string;
}
