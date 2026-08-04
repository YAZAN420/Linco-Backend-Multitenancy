import { DemoMemberResponseDto } from 'src/demos/presentation/http/dto/demo-member/demo-member-response.dto';
import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';
import { InquiryReplyResponseDto } from 'src/inquiryReplies/presentation/http/dto/inquiryReply-response.dto';

export class InquiryResponseDto {
  constructor(
    readonly id: string,
    readonly subject: string,
    readonly message: string,
    readonly demoId: string,
    readonly status: InquiryStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly creator: DemoMemberResponseDto,
    readonly reply?: InquiryReplyResponseDto
  ) {}
}
