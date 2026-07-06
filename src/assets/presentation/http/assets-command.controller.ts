import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetResponseMapper } from './mappers/asset-response.mapper';
import { AssetsCommandService } from 'src/assets/application/assets-command.service';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';
import { AssetsQueryService } from 'src/assets/application/assets-query.service';

@Controller('demos/:demoId/assets')
export class AssetsCommandController {
  constructor(
    private readonly assetCommandService: AssetsCommandService,
    private readonly assetQueryService: AssetsQueryService,
    private readonly assetResponseMapper: AssetResponseMapper,
  ) {}

  @Post()
  async create(@Param('demoId') demoId: string, @Body() dto: CreateAssetDto) {
    const createdAsset = await this.assetCommandService.create(demoId, {
      ...dto,
      accessMethod: AccessMethod.PURCHASED,
    });
    const asset = await this.assetQueryService.findById(
      demoId,
      createdAsset.id,
    );
    return {
      message: 'Asset created successfully',
      data: this.assetResponseMapper.toResponseFromPrisma(asset),
    };
  }

  @Patch(':assetId')
  async update(
    @Param('demoId') demoId: string,
    @Param('assetId') assetId: string,
    @Body() dto: UpdateAssetDto,
  ) {
    const updatedAsset = await this.assetCommandService.update(
      demoId,
      assetId,
      dto,
    );
    const asset = await this.assetQueryService.findById(
      demoId,
      updatedAsset.id,
    );
    return {
      message: 'Asset updated successfully',
      data: this.assetResponseMapper.toResponseFromPrisma(asset),
    };
  }

  @Delete(':assetId')
  async remove(
    @Param('demoId') demoId: string,
    @Param('assetId') assetId: string,
  ) {
    await this.assetCommandService.remove(demoId, assetId);

    return {
      message: 'Asset deleted successfully',
      data: null,
    };
  }
}
