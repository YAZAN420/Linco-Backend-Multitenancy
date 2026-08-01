import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindInquiriesCursorQuery } from '../interfaces/find-inquiries.query';
import { InquiryWithDemoMember } from 'src/core/database/prisma/types';

export abstract class InquiryQueryRepository {
  abstract findAllCursor(
    demoId: string,
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<InquiryWithDemoMember>>;
  abstract findById(
    id: string,
    demoId: string,
  ): Promise<InquiryWithDemoMember | null>;
}
