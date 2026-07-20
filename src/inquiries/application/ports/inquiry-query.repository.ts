import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindInquiriesCursorQuery } from '../interfaces/find-inquiries.query';
import { Inquiry } from 'src/generated/prisma/client';

export abstract class InquiryQueryRepository {
  abstract findAllCursor(
    demoId: string,
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<Inquiry>>;
  abstract findById(id: string): Promise<Inquiry | null>;
}
