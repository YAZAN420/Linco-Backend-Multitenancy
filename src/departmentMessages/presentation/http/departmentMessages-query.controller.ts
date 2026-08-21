import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DepartmentMessagesQueryService } from 'src/departmentMessages/application/departmentMessages-query.service';
import { DepartmentMessageResponseMapper } from '../mappers/departmentMessage-response.mapper';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';

@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('departmentMessages')
export class DepartmentMessagesQueryController {
  constructor(
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
    private readonly departmentMessageResponseMapper: DepartmentMessageResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departmentMessages =
      await this.departmentMessageQueryService.findAllCursor(
        departmentId,
        options,
      );

    return {
      message: 'messages.DEPARTMENT_MESSAGES_FETCHED_SUCCESSFULLY',
      data: this.departmentMessageResponseMapper.toResponseManyFromPrisma(
        departmentMessages.data,
      ),
      meta: departmentMessages.meta,
    };
  }

  @Get(':departmentMessageId')
  async findOne(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Param('departmentMessageId') departmentMessageId: string,
  ) {
    const departmentMessage = await this.departmentMessageQueryService.findById(
      departmentId,
      departmentMessageId,
    );

    return {
      message: 'messages.DEPARTMENT_MESSAGE_RETRIEVED_SUCCESSFULLY',
      data: this.departmentMessageResponseMapper.toResponseFromPrisma(
        departmentMessage,
      ),
    };
  }
}
