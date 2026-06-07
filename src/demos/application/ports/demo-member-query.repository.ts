import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoMember as PrismaDemoMember } from 'src/generated/prisma/client';
import { FindDemoMembersCursorQuery } from '../interfaces/find-demos.query';

export abstract class DemoMemberQueryRepository {
  abstract findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<PrismaDemoMember>>;

  abstract findById(
    demoId: string,
    memberId: string,
  ): Promise<PrismaDemoMember | null>;
}
