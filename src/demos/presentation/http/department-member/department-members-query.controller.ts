import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DepartmentMembersQueryService } from 'src/demos/application/department-member/department-members-query.service';
import { DepartmentMemberResponseMapper } from '../mappers/department-member-response.mapper copy';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';

@ApiTags('DepartmentMember')
@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('departmentMembers')
export class DepartmentMembersQueryController {
  constructor(
    private readonly departmentMembersQueryService: DepartmentMembersQueryService,
    private readonly departmentMemberResponseMapper: DepartmentMemberResponseMapper,
  ) {}

  @Get()
  async findAllByDepartment(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const members =
      await this.departmentMembersQueryService.findAllByDepartment(
        departmentId,
        options,
      );

    return {
      message: 'messages.DEPARTMENT_MEMBERS_FETCHED_SUCCESSFULLY',
      data: this.departmentMemberResponseMapper.toResponseManyFromPrisma(
        members.data,
      ),
      meta: members.meta,
    };
  }

  @Get(':memberId')
  async findMember(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Param('memberId') memberId: string,
  ) {
    const member = await this.departmentMembersQueryService.findById(
      departmentId,
      memberId,
    );

    return {
      message: 'messages.DEPARTMENT_MEMBER_RETRIEVED_SUCCESSFULLY',
      data: this.departmentMemberResponseMapper.toResponseFromPrisma(member),
    };
  }
}
