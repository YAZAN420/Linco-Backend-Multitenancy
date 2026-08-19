import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindInquiriesCursorQuery } from '../interfaces/find-inquiries.query';
import { InquiryWithReply } from 'src/core/database/prisma/types';

export abstract class InquiryQueryRepository {
  abstract findAllCursor(
    demoId: string,
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<InquiryWithReply>>;
  abstract findById(
    id: string,
    demoId?: string,
  ): Promise<InquiryWithReply | null>;
  abstract findAllForMe(
    demoId: string,
    userId: string,
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<InquiryWithReply>>;
}
