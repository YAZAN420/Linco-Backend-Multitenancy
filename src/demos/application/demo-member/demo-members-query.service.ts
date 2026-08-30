import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { DemoMemberQueryRepository } from '../ports/demo-member/demo-member-query.repository';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';
import { FindDemoMembersCursorQuery } from './interfaces/find-demo-members.query';

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
      throw new NotFoundException('errors.DEMO_NOT_FOUND');
    }
    return await this.demoMemberQueryRepository.findAllByDemo(demoId, options);
  }

  async findById(
    demoId: string,
    memberId: string,
  ): Promise<DemoMemberWithUser> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('errors.DEMO_NOT_FOUND');
    }
    const member = await this.demoMemberQueryRepository.findById(memberId);
    if (!member) {
      throw new NotFoundException('errors.MEMBER_NOT_FOUND_IN_THIS_DEMO');
    }
    return member;
  }

  async findByUserId(demoId: string, userId: string) {
    return this.demoMemberQueryRepository.findDemoMemberByUserId(
      demoId,
      userId,
    );
  }
}
