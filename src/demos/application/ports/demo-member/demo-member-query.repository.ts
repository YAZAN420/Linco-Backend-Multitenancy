import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { DemoMember } from 'src/generated/prisma/client';
import { FindDemoMembersCursorQuery } from '../../demo/interfaces/find-demos.query';

export abstract class DemoMemberQueryRepository {
  abstract findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>>;

  abstract findById(
    demoId: string,
    memberId: string,
  ): Promise<DemoMemberWithUser | null>;

  abstract findDemoMemberByUserId(userId: string): Promise<DemoMember | null>;
}
