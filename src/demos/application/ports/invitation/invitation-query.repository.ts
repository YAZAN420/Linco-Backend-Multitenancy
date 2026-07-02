import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindCursorQuery } from 'src/common/interfaces/find.query';

import { Invitation } from 'src/generated/prisma/client';

export abstract class InvitationQueryRepository {
  abstract findAllCursor(
    receiverId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Invitation>>;
  abstract findById(id: string): Promise<Invitation | null>;
}
