import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindInquiryMessagesCursorQuery,
  FindInquiryMessagesQuery,
} from '../interfaces/find-inquiryMessages.query';
import { InquiryMessage } from 'src/generated/prisma/client';

export abstract class InquiryMessageQueryRepository {
  abstract findAll(options: FindInquiryMessagesQuery): Promise<PageDto<InquiryMessage>>;
  abstract findAllCursor(
    options: FindInquiryMessagesCursorQuery,
  ): Promise<CursorPageDto<InquiryMessage>>;
  abstract findById(id: string): Promise<InquiryMessage | null>;
}
