import { Controller, Get, Query } from '@nestjs/common';

import { FindDemosDto } from '../dto/filters/find-demos.dto';

import { DemoResponseMapper } from '../mappers/demo-response.mapper';
import { DemosQueryService } from 'src/demos/application/demo/demos-query.service';

@Controller('admin/demos')
export class AdminDemosQueryController {
  constructor(
    private readonly demoQueryService: DemosQueryService,
    private readonly demoResponseMapper: DemoResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: FindDemosDto) {
    const demos = await this.demoQueryService.findAll(options);
    return {
      message: 'Demos fetched successfully',
      data: this.demoResponseMapper.toResponseManyFromPrisma(demos.data),
      meta: demos.meta,
    };
  }
}
