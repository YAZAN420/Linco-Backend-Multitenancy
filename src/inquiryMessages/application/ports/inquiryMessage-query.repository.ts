import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindInquiryMessagesCursorQuery } from '../interfaces/find-inquiryMessages.query';
import { InquiryMessage } from 'src/generated/prisma/client';

export abstract class InquiryMessageQueryRepository {
  abstract findAllCursor(
    inquiryId: string,
    options: FindInquiryMessagesCursorQuery,
  ): Promise<CursorPageDto<InquiryMessage>>;
  abstract findById(id: string): Promise<InquiryMessage | null>;
}
