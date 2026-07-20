import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInquiryInput } from 'src/inquiries/application/interfaces/create-inquiry-input.interface';

export class CreateInquiryDto implements CreateInquiryInput {
  @IsString()
  @IsNotEmpty()
  subject!: string;
}
