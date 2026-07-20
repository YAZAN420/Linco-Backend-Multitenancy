import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import { FindCursorQuery, FindQuery } from 'src/common/interfaces/find.query';

import { Payment } from 'src/generated/prisma/client';

export abstract class PaymentQueryRepository {
  abstract findAll(options: FindQuery): Promise<PageDto<Payment>>;
  abstract findAllCursor(
    userId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Payment>>;
  abstract findById(id: string): Promise<Payment | null>;
}
