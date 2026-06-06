import { Controller, Get, Param, Query } from '@nestjs/common';
import { DemoMembersQueryService } from 'src/demos/application/demo-members-query.service';
import { DemoMemberResponseMapper } from './mappers/demo-member-response.mapper';
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

  @Get(':userId')
  async findMember(
    @Param('demoId') demoId: string,
    @Param('userId') userId: string,
  ) {
    const member = await this.demoMembersQueryService.findByDemoAndUser(
      demoId,
      userId,
    );

    return {
      message: 'Member retrieved successfully',
      data: this.demoMemberResponseMapper.toResponseFromPrisma(member),
    };
  }
}
