import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DemosQueryService } from 'src/demos/application/demo/demos-query.service';

import { DemoResponseMapper } from '../mappers/demo-response.mapper';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { Role } from 'src/users/domain/enums/role.enum';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { FindAdminDemosDto } from '../dto/demo/find-admin-demos.dto';

@ApiTags('Demo')
@Controller('demos')
export class DemosQueryController {
  constructor(
    private readonly demoQueryService: DemosQueryService,
    private readonly demoResponseMapper: DemoResponseMapper,
  ) {}

  @Roles([Role.ADMIN])
  @Get('admin')
  async findAll(@Query() options: FindAdminDemosDto) {
    const result = await this.demoQueryService.findAll(options);
    return {
      message: 'messages.ADMIN_DEMOS_FETCHED_SUCCESSFULLY',
      data: this.demoResponseMapper.toAdminResponseManyFromPrisma(result.data),
      meta: result.meta,
    };
  }

  @Get()
  async findAllForMe(
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const demos = await this.demoQueryService.findAllForMe(options, user.id);

    return {
      message: 'messages.DEMOS_FETCHED_SUCCESSFULLY',
      data: this.demoResponseMapper.toResponseManyFromPrisma(demos.data),
      meta: demos.meta,
    };
  }

  @Roles([Role.ADMIN])
  @Get('stats')
  async getAdminStats() {
    const stats = await this.demoQueryService.getAdminStats();
    return {
      message: 'messages.ADMIN_DEMO_STATS_FETCHED_SUCCESSFULLY',
      data: stats,
    };
  }

  @Get(':id')
  @UseGuards(DemoRolesGuard)
  async findOne(@ActiveUser() user: ActiveUserData, @Param('id') id: string) {
    const demo = await this.demoQueryService.findById(user.id, id);
    return {
      message: 'messages.DEMO_RETRIEVED_SUCCESSFULLY',
      data: this.demoResponseMapper.toResponseFromPrisma(demo),
    };
  }
}
