import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindInquiryRepliesCursorQuery,
} from '../interfaces/find-inquiryReplies.query';
import { InquiryReply } from 'src/generated/prisma/client';

export abstract class InquiryReplyQueryRepository {
  abstract findAllCursor(
    inquiryId: string,
    options: FindInquiryRepliesCursorQuery,
  ): Promise<CursorPageDto<InquiryReply>>;
  abstract findById(id: string): Promise<InquiryReply | null>;
}
