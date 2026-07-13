import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InquiryStatus } from 'src/generated/prisma/enums';
import { UpdateInquiryInput } from 'src/inquiries/application/interfaces/update-inquiry-input.interface';

export class UpdateInquiryDto implements UpdateInquiryInput {
    @IsString()
    @IsNotEmpty()
    @IsOptional() 
    subject!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() 
    recipientId!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional() 
    creatorId!: string;

    @IsString() 
    @IsNotEmpty()
    @IsOptional()
    status!: InquiryStatus;
}
