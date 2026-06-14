import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindDemoMembersCursorQuery } from '../interfaces/find-demos.query';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';

export abstract class DemoMemberQueryRepository {
  abstract findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>>;

  abstract findById(
    demoId: string,
    memberId: string,
  ): Promise<DemoMemberWithUser | null>;
}
