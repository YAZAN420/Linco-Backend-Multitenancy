import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInquiryMessageInput } from 'src/inquiryMessages/application/interfaces/create-inquiryMessage-input.interface';

export class CreateInquiryMessageDto implements CreateInquiryMessageInput {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
