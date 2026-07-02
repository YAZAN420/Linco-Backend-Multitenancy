import { Controller, Patch, Delete, Body, Param } from '@nestjs/common';

import { UpdateDemoMemberDto } from '../dto/demo-member/update-demo-member.dto';
import { DemoMembersCommandService } from 'src/demos/application/demo-member/demo-members-command.service';

@Controller('demos/:demoId/members')
export class DemoMembersCommandController {
  constructor(
    private readonly demoMembersCommandService: DemoMembersCommandService,
  ) {}

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
