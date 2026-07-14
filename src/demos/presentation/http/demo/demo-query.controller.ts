import { Controller, Get, Param, Query } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { DemosQueryService } from 'src/demos/application/demo/demos-query.service';

import { DemoResponseMapper } from '../mappers/demo-response.mapper';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Demo')
@Controller('demos')
export class DemosQueryController {
  constructor(
    private readonly demoQueryService: DemosQueryService,
    private readonly demoResponseMapper: DemoResponseMapper,
  ) {}

  @Get()
  async findAllForMe(
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const demos = await this.demoQueryService.findAllForMe(options, user.id);

    return {
      message: 'Demos fetched successfully ',
      data: this.demoResponseMapper.toResponseManyFromPrisma(demos.data),
      meta: demos.meta,
    };
  }

  @Get(':id')
  async findOne(@ActiveUser() user: ActiveUserData, @Param('id') id: string) {
    const demo = await this.demoQueryService.findById(user.id, id);
    return {
      message: 'Demo retrieved successfully',
      data: this.demoResponseMapper.toResponseFromPrisma(demo),
    };
  }
}
