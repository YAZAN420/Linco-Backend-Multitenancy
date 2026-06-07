import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DemoMembersCommandService } from 'src/demos/application/demo-members-command.service';
import { CreateDemoMemberDto } from './dto/create-demo-member.dto';
import { UpdateDemoMemberDto } from './dto/update-demo-member.dto';

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
  @HttpCode(HttpStatus.OK)
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
