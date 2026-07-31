import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateInquiryReplyInput } from 'src/inquiryReplies/application/interfaces/create-inquiryReply-input.interface';
import { InquirySenderType } from 'src/inquiryReplies/domain/enums/InquirySenderType';

export class CreateInquiryReplyDto implements CreateInquiryReplyInput {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  inquiryId!: string;

  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsEnum(InquirySenderType)
  @IsNotEmpty()
  senderType!: InquirySenderType;
}
