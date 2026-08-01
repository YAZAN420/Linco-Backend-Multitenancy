import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindInquiryRepliesCursorQuery } from '../interfaces/find-inquiryReplies.query';

import { InquiryReplyWithDemoMember } from 'src/core/database/prisma/types';

export abstract class InquiryReplyQueryRepository {
  abstract findAllCursor(
    inquiryId: string,
    options: FindInquiryRepliesCursorQuery,
  ): Promise<CursorPageDto<InquiryReplyWithDemoMember>>;
  abstract findById(id: string): Promise<InquiryReplyWithDemoMember | null>;
}
