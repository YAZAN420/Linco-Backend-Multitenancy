import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateInquiryReplyInput } from 'src/inquiryReplies/application/interfaces/update-inquiryReply-input.interface';

export class UpdateInquiryReplyDto implements UpdateInquiryReplyInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string;
}
