import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetResponseMapper } from './mappers/asset-response.mapper';
import { AssetsCommandService } from 'src/assets/application/assets-command.service';
import { AssetsQueryService } from 'src/assets/application/assets-query.service';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('Asset')
@UseGuards(DemoRolesGuard)
@Controller('assets')
export class AssetsCommandController {
  constructor(
    private readonly assetCommandService: AssetsCommandService,
    private readonly assetQueryService: AssetsQueryService,
    private readonly assetResponseMapper: AssetResponseMapper,
  ) {}

  @Patch(':assetId')
  async update(
    @ActiveDemoMember('demoId') demoId: string,
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
      message: 'messages.ASSET_UPDATED_SUCCESSFULLY',
      data: this.assetResponseMapper.toResponseFromPrisma(asset),
    };
  }

  @Delete(':assetId')
  async remove(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('assetId') assetId: string,
  ) {
    await this.assetCommandService.remove(demoId, assetId);

    return {
      message: 'messages.ASSET_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
