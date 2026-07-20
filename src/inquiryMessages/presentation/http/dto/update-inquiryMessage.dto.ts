import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateInquiryMessageInput } from 'src/inquiryMessages/application/interfaces/update-inquiryMessage-input.interface';

export class UpdateInquiryMessageDto implements UpdateInquiryMessageInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  senderId!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  inquiryId!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message!: string;
}
