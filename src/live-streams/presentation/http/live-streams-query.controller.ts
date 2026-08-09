import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ActiveDepartmentMemberData } from 'src/iam/domain/interfaces/active-department-member.interface';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { LiveStreamsQueryService } from 'src/live-streams/application/live-streams-query.service';
import { LiveStreamHttpMapper } from './mappers/live-stream-http.mapper';

@ApiTags('LiveStreams')
@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('liveStreams')
export class LiveStreamsQueryController {
  constructor(
    private readonly service: LiveStreamsQueryService,
    private readonly mapper: LiveStreamHttpMapper,
  ) {}

  @Get('cursor')
  async findAll(
    @ActiveDepartmentMember() member: ActiveDepartmentMemberData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const page = await this.service.findAll(
      member.departmentId,
      member.demoId,
      { cursor: options.cursor, take: options.take },
    );
    return {
      message: 'messages.LIVE_STREAMS_FETCHED_SUCCESSFULLY',
      data: this.mapper.toResponseMany(page.data),
      meta: page.meta,
    };
  }

  @Get(':liveStreamId')
  async findById(
    @ActiveDepartmentMember() member: ActiveDepartmentMemberData,
    @Param('liveStreamId') id: string,
  ) {
    const stream = await this.service.findById(
      id,
      member.departmentId,
      member.demoId,
    );
    return {
      message: 'messages.LIVE_STREAM_FETCHED_SUCCESSFULLY',
      data: this.mapper.toResponse(stream),
    };
  }
}
