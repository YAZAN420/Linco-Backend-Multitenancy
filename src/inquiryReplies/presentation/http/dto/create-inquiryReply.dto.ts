import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInquiryReplyInput } from 'src/inquiryReplies/application/interfaces/create-inquiryReply-input.interface';

export class CreateInquiryReplyDto implements CreateInquiryReplyInput {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
