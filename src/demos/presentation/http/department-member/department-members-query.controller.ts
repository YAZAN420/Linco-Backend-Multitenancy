import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DepartmentMembersQueryService } from 'src/demos/application/department-member/department-members-query.service';
import { DepartmentMemberResponseMapper } from '../mappers/department-member-response.mapper copy';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';

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
    @Param('departmentId') departmentId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const members =
      await this.departmentMembersQueryService.findAllByDepartment(
        departmentId,
        options,
      );

    return {
      message: 'Members fetched successfully',
      data: this.departmentMemberResponseMapper.toResponseManyFromPrisma(
        members.data,
      ),
      meta: members.meta,
    };
  }

  @Get(':memberId')
  async findMember(
    @Param('departmentId') departmentId: string,
    @Param('memberId') memberId: string,
  ) {
    const member = await this.departmentMembersQueryService.findById(
      departmentId,
      memberId,
    );

    return {
      message: 'Member retrieved successfully',
      data: this.departmentMemberResponseMapper.toResponseFromPrisma(member),
    };
  }
}
