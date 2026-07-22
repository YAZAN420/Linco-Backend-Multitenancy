import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { AssetsQueryService } from 'src/assets/application/assets-query.service';
import { AssetResponseMapper } from './mappers/asset-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('Asset')
@UseGuards(DemoRolesGuard)
@Controller('assets')
export class AssetsQueryController {
  constructor(
    private readonly assetQueryService: AssetsQueryService,
    private readonly assetResponseMapper: AssetResponseMapper,
  ) {}

  @Get()
  async findAll(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() options: PageOptionsDto,
  ) {
    const assets = await this.assetQueryService.findAll(demoId, options);
    return {
      message: 'Assets fetched successfully',
      data: this.assetResponseMapper.toResponseManyFromPrisma(assets.data),
      meta: assets.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const assets = await this.assetQueryService.findAllCursor(demoId, options);

    return {
      message: 'Assets fetched successfully',
      data: this.assetResponseMapper.toResponseManyFromPrisma(assets.data),
      meta: assets.meta,
    };
  }

  @Get(':assetId')
  async findOne(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('assetId') assetId: string,
  ) {
    const asset = await this.assetQueryService.findById(demoId, assetId);

    return {
      message: 'Asset retrieved successfully',
      data: this.assetResponseMapper.toResponseFromPrisma(asset),
    };
  }
}
