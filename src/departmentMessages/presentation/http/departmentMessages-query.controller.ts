import { Controller, Get, Param, Query } from '@nestjs/common';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DepartmentMessagesQueryService } from 'src/departmentMessages/application/departmentMessages-query.service';
import { DepartmentMessageResponseMapper } from '../mappers/departmentMessage-response.mapper';

@Controller('departmentMessages')
export class DepartmentMessagesQueryController {
  constructor(
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
    private readonly departmentMessageResponseMapper: DepartmentMessageResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('departmentId') departmentId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departmentMessages =
      await this.departmentMessageQueryService.findAllCursor(
        departmentId,
        options,
      );

    return {
      message: 'DepartmentMessages fetched successfully ',
      data: this.departmentMessageResponseMapper.toResponseManyFromPrisma(
        departmentMessages.data,
      ),
      meta: departmentMessages.meta,
    };
  }

  @Get(':departmentMessageId')
  async findOne(@Param('departmentMessageId') departmentMessageId: string) {
    const departmentMessage =
      await this.departmentMessageQueryService.findById(departmentMessageId);

    return {
      message: 'DepartmentMessage retrieved successfully',
      data: this.departmentMessageResponseMapper.toResponseFromPrisma(
        departmentMessage,
      ),
    };
  }
}
