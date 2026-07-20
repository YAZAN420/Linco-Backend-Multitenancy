import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { DemoMember } from 'src/generated/prisma/client';
import { FindDemoMembersCursorQuery } from '../../demo-member/interfaces/find-demo-members.query';

export abstract class DemoMemberQueryRepository {
  abstract findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>>;

  abstract findById(memberId: string): Promise<DemoMemberWithUser | null>;

  abstract findDemoMemberByUserId(
    demoId: string,
    userId: string,
  ): Promise<DemoMember | null>;
}
