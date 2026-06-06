import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoMemberQueryRepository } from './ports/demo-member-query.repository';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoMember as PrismaDemoMember } from 'src/generated/prisma/client';
import { FindDemoMembersCursorQuery } from './interfaces/find-demos.query';

@Injectable()
export class DemoMembersQueryService {
  constructor(
    private readonly demoMemberQueryRepository: DemoMemberQueryRepository,
  ) {}

  async findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<PrismaDemoMember>> {
    return this.demoMemberQueryRepository.findAllByDemo(demoId, options);
  }

  async findByDemoAndUser(
    demoId: string,
    userId: string,
  ): Promise<PrismaDemoMember> {
    const member = await this.demoMemberQueryRepository.findByDemoAndUser(
      demoId,
      userId,
    );
    if (!member) {
      throw new NotFoundException('Member not found in this demo');
    }
    return member;
  }
}
