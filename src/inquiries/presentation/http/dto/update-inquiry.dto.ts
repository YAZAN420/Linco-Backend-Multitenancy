import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateInquiryInput } from 'src/inquiries/application/interfaces/update-inquiry-input.interface';
import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';

export class UpdateInquiryDto implements UpdateInquiryInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status!: InquiryStatus;
}
