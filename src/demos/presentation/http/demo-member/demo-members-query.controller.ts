import { Controller, Get, Param, Query } from '@nestjs/common';

import { DemoMemberResponseMapper } from '../mappers/demo-member-response.mapper';
import { DemoMembersQueryService } from 'src/demos/application/demo-member/demo-members-query.service';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

@Controller('demos/:demoId/members')
export class DemoMembersQueryController {
  constructor(
    private readonly demoMembersQueryService: DemoMembersQueryService,
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}

  @Get()
  async findAllByDemo(
    @Param('demoId') demoId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    console.log(options);
    const members = await this.demoMembersQueryService.findAllByDemo(
      demoId,
      options,
    );

    return {
      message: 'Members fetched successfully',
      data: this.demoMemberResponseMapper.toResponseManyFromPrisma(
        members.data,
      ),
      meta: members.meta,
    };
  }

  @Get(':memberId')
  async findMember(
    @Param('demoId') demoId: string,
    @Param('memberId') memberId: string,
  ) {
    const member = await this.demoMembersQueryService.findById(
      demoId,
      memberId,
    );

    return {
      message: 'Member retrieved successfully',
      data: this.demoMemberResponseMapper.toResponseFromPrisma(member),
    };
  }
}
