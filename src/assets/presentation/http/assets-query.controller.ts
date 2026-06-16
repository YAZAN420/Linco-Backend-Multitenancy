import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAssetsDto } from './dto/filters/find-assets.dto';
import { FindAssetsCursorDto } from './dto/filters/find-assets-cursor.dto';
import { AssetsQueryService } from 'src/assets/application/assets-query.service';
import { AssetResponseMapper } from './mappers/asset-response.mapper';

@Controller('demos/:demoId/assets')
export class AssetsQueryController {
  constructor(
    private readonly assetQueryService: AssetsQueryService,
    private readonly assetResponseMapper: AssetResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('demoId') demoId: string,
    @Query() options: FindAssetsDto,
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
    @Param('demoId') demoId: string,
    @Query() options: FindAssetsCursorDto,
  ) {
    const assets = await this.assetQueryService.findAllCursor(demoId, options);

    return {
      message: 'Assets fetched successfully (Cursor)',
      data: this.assetResponseMapper.toResponseManyFromPrisma(assets.data),
      meta: assets.meta,
    };
  }

  @Get(':assetId')
  async findOne(
    @Param('demoId') demoId: string,
    @Param('assetId') assetId: string,
  ) {
    const asset = await this.assetQueryService.findById(demoId, assetId);

    return {
      message: 'Asset retrieved successfully',
      data: this.assetResponseMapper.toResponseFromPrisma(asset),
    };
  }
}
