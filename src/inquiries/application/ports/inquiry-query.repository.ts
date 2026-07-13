import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindInquiriesCursorQuery,
  FindInquiriesQuery,
} from '../interfaces/find-inquiries.query';
import { Inquiry } from 'src/generated/prisma/client';

export abstract class InquiryQueryRepository {
  abstract findAll(options: FindInquiriesQuery): Promise<PageDto<Inquiry>>;
  abstract findAllCursor(
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<Inquiry>>;
  abstract findById(id: string): Promise<Inquiry | null>;
}
