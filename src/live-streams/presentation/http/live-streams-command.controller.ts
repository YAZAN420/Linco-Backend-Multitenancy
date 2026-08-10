import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';
import { ActiveDepartmentMemberData } from 'src/iam/domain/interfaces/active-department-member.interface';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';
import { DepartmentRoles } from 'src/iam/presentation/http/decorators/department-roles.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { LiveStreamsCommandService } from 'src/live-streams/application/live-streams-command.service';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';
import { LiveStreamHttpMapper } from './mappers/live-stream-http.mapper';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';

@ApiTags('LiveStreams')
@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('liveStreams')
export class LiveStreamsCommandController {
  constructor(
    private readonly service: LiveStreamsCommandService,
    private readonly mapper: LiveStreamHttpMapper,
  ) {}

  @Post()
  @DepartmentRoles([DepartmentMemberRole.MANAGER])
  async create(
    @ActiveDepartmentMember() departmentMember: ActiveDepartmentMemberData,
    @Body() dto: CreateLiveStreamDto,
  ) {
    const stream = await this.service.create(
      departmentMember.demoId,
      departmentMember.departmentId,
      departmentMember.id,
      dto,
    );
    return {
      message: 'messages.LIVE_STREAM_CREATED_SUCCESSFULLY',
      data: this.mapper.toResponse(stream),
    };
  }

  @Patch(':liveStreamId')
  @DepartmentRoles([DepartmentMemberRole.MANAGER])
  async update(
    @ActiveDepartmentMember() departmentMember: ActiveDepartmentMemberData,
    @Param('liveStreamId') id: string,
    @Body() dto: UpdateLiveStreamDto,
  ) {
    const stream = await this.service.update(
      departmentMember.demoId,
      departmentMember.departmentId,
      id,
      dto,
    );
    return {
      message: 'messages.LIVE_STREAM_UPDATED_SUCCESSFULLY',
      data: this.mapper.toResponse(stream),
    };
  }

  @Post(':liveStreamId/start')
  async start(
    @ActiveDepartmentMember() member: ActiveDepartmentMemberData,
    @Param('liveStreamId') liveStreamId: string,
  ) {
    const stream = await this.service.start({
      liveStreamId,
      demoId: member.demoId,
      departmentId: member.departmentId,
      departmentMemberId: member.id,
      isDepartmentManager: member.role === DepartmentMemberRole.MANAGER,
    });
    return {
      message: 'messages.LIVE_STREAM_STARTED_SUCCESSFULLY',
      data: this.mapper.toResponse(stream),
    };
  }

  @Post(':liveStreamId/end')
  async end(
    @ActiveDepartmentMember() member: ActiveDepartmentMemberData,
    @Param('liveStreamId') liveStreamId: string,
  ) {
    const stream = await this.service.end({
      liveStreamId,
      demoId: member.demoId,
      departmentId: member.departmentId,
      departmentMemberId: member.id,
      isDepartmentManager: member.role === DepartmentMemberRole.MANAGER,
    });
    return {
      message: 'messages.LIVE_STREAM_ENDED_SUCCESSFULLY',
      data: this.mapper.toResponse(stream),
    };
  }

  @Post(':liveStreamId/token')
  async generateToken(
    @ActiveUser() user: ActiveUserData,
    @ActiveDepartmentMember() member: ActiveDepartmentMemberData,
    @Param('liveStreamId') liveStreamId: string,
  ) {
    const data = await this.service.generateToken(user, {
      liveStreamId,
      demoId: member.demoId,
      departmentId: member.departmentId,
      departmentMemberId: member.id,
    });
    return {
      message: 'messages.LIVE_STREAM_TOKEN_GENERATED_SUCCESSFULLY',
      data,
    };
  }
}
