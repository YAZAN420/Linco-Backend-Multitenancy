import { DemoMemberResponseDto } from 'src/demos/presentation/http/dto/demo-member/demo-member-response.dto';
import { InquirySenderType } from 'src/inquiryReplies/domain/enums/InquirySenderType';

export class InquiryReplyResponseDto {
  constructor(
    readonly id: string,
    readonly inquiryId: string,
    readonly senderType: InquirySenderType,
    readonly message: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly sender: DemoMemberResponseDto,
  ) {}
}
