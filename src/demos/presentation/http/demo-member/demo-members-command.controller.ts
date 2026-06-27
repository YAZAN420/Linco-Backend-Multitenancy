import { Controller, Post, Patch, Delete, Body, Param } from '@nestjs/common';

import { CreateDemoMemberDto } from '../dto/demo-member/create-demo-member.dto';
import { UpdateDemoMemberDto } from '../dto/demo-member/update-demo-member.dto';
import { DemoMembersCommandService } from 'src/demos/application/demo-member/demo-members-command.service';

@Controller('demos/:demoId/members')
export class DemoMembersCommandController {
  constructor(
    private readonly demoMembersCommandService: DemoMembersCommandService,
  ) {}

  @Post()
  async addMember(
    @Param('demoId') demoId: string,
    @Body() dto: CreateDemoMemberDto,
  ) {
    await this.demoMembersCommandService.addMember(demoId, {
      userId: dto.userId,
      role: dto.role,
    });

    return {
      message: 'Member added successfully',
      data: null,
    };
  }

  @Patch(':memberId')
  async updateMemberRole(
    @Param('demoId') demoId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateDemoMemberDto,
  ) {
    await this.demoMembersCommandService.updateMemberRole(demoId, memberId, {
      role: dto.role,
    });

    return {
      message: 'Member role updated successfully',
      data: null,
    };
  }

  @Delete(':memberId')
  async removeMember(
    @Param('demoId') demoId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.demoMembersCommandService.removeMember(demoId, memberId);

    return {
      message: 'Member removed successfully',
      data: null,
    };
  }
}
