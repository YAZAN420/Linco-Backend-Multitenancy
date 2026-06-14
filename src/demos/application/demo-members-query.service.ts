import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoMemberQueryRepository } from './ports/demo-member-query.repository';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindDemoMembersCursorQuery } from './interfaces/find-demos.query';
import { DemoQueryRepository } from './ports/demo-query.repository';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';

@Injectable()
export class DemoMembersQueryService {
  constructor(
    private readonly demoMemberQueryRepository: DemoMemberQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    return await this.demoMemberQueryRepository.findAllByDemo(demoId, options);
  }

  async findById(
    demoId: string,
    memberId: string,
  ): Promise<DemoMemberWithUser> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    const member = await this.demoMemberQueryRepository.findById(
      demoId,
      memberId,
    );
    if (!member) {
      throw new NotFoundException('Member not found in this demo');
    }
    return member;
  }
}
