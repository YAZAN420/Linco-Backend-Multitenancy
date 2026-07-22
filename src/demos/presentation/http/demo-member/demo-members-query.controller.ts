import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { DemoMemberResponseMapper } from '../mappers/demo-member-response.mapper';
import { DemoMembersQueryService } from 'src/demos/application/demo-member/demo-members-query.service';
import { DemoMembersQueryDto } from '../dto/demo-member/demo-members-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';

@ApiTags('DemoMember')
@UseGuards(DemoRolesGuard)
@Controller('members')
export class DemoMembersQueryController {
  constructor(
    private readonly demoMembersQueryService: DemoMembersQueryService,
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}

  @Get()
  async findAllByDemo(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() options: DemoMembersQueryDto,
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

  @Get(':memberId')
  async findMember(
    @ActiveDemoMember('demoId') demoId: string,
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
