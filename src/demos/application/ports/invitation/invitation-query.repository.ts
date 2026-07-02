import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { InvitationWithUserAndDemo } from 'src/core/database/prisma/types';

export abstract class InvitationQueryRepository {
  abstract findAllCursor(
    receiverId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<InvitationWithUserAndDemo>>;
  abstract findById(id: string): Promise<InvitationWithUserAndDemo | null>;
}
