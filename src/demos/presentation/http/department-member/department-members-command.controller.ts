import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DepartmentMembersCommandService } from 'src/demos/application/department-member/department-members-command.service';
import { CreateDepartmentMemberDto } from '../dto/department-member/create-department-member.dto';
import { UpdateDepartmentMemberDto } from '../dto/department-member/update-department-member.dto';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';

@ApiTags('DepartmentMember')
@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('departmentMembers')
export class DepartmentMembersCommandController {
  constructor(
    private readonly departmentMembersCommandService: DepartmentMembersCommandService,
  ) {}

  @Post()
  async addMember(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Body() dto: CreateDepartmentMemberDto,
  ) {
    await this.departmentMembersCommandService.addMember(departmentId, {
      demoMemberId: dto.demoMemberId,
      jobTitle: dto.jobTitle,
    });

    return {
      message: 'Member added successfully',
      data: null,
    };
  }

  @Patch(':memberId')
  async updateMemberRole(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateDepartmentMemberDto,
  ) {
    await this.departmentMembersCommandService.updateMemberJobTitle(
      departmentId,
      memberId,
      {
        jobTitle: dto.jobTitle,
      },
    );

    return {
      message: 'Member role updated successfully',
      data: null,
    };
  }

  @Delete(':memberId')
  async removeMember(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.departmentMembersCommandService.removeMember(
      departmentId,
      memberId,
    );

    return {
      message: 'Member removed successfully',
      data: null,
    };
  }
}
