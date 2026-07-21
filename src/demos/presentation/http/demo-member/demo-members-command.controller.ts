import {
  Controller,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { UpdateDemoMemberDto } from '../dto/demo-member/update-demo-member.dto';
import { DemoMembersCommandService } from 'src/demos/application/demo-member/demo-members-command.service';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('DemoMember')
@UseGuards(DemoRolesGuard)
@Controller('/members')
export class DemoMembersCommandController {
  constructor(
    private readonly demoMembersCommandService: DemoMembersCommandService,
  ) {}

  @Patch(':memberId')
  async updateMemberRole(
    @ActiveDemoMember('demoId') demoId: string,
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
    @ActiveDemoMember('demoId') demoId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.demoMembersCommandService.removeMember(demoId, memberId);

    return {
      message: 'Member removed successfully',
      data: null,
    };
  }
}
