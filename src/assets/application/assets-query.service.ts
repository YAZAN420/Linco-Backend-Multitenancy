import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindAssetsCursorQuery,
  FindAssetsQuery,
} from './interfaces/find-assets.query';
import { AssetQueryRepository } from './ports/asset-query.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';
import { AssetWithCourse } from 'src/core/database/prisma/types';

@Injectable()
export class AssetsQueryService {
  constructor(
    private readonly assetQueryRepository: AssetQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAll(
    demoId: string,
    pageOptionsDto: FindAssetsQuery,
  ): Promise<PageDto<AssetWithCourse>> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    return this.assetQueryRepository.findAll(demoId, pageOptionsDto);
  }

  async findAllCursor(
    demoId: string,
    options: FindAssetsCursorQuery,
  ): Promise<CursorPageDto<AssetWithCourse>> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    return this.assetQueryRepository.findAllCursor(demoId, options);
  }

  async findById(demoId: string, assetId: string): Promise<AssetWithCourse> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    const asset = await this.assetQueryRepository.findById(assetId);
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }
}
