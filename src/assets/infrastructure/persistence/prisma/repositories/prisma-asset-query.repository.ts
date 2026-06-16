import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Asset } from 'src/generated/prisma/client';

import {
  FindAssetsCursorQuery,
  FindAssetsQuery,
} from 'src/assets/application/interfaces/find-assets.query';
import { AssetQueryRepository } from 'src/assets/application/ports/asset-query.repository';

const ASSET_SEARCH_COLUMNS = [];
const ASSET_ORDERABLE_FIELDS = ['acquiredAt'];

@Injectable()
export class PrismaAssetQueryRepository implements AssetQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindAssetsQuery | FindAssetsCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.AssetWhereInput>(
        options,
        ASSET_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, ASSET_ORDERABLE_FIELDS),
    };
  }

  async findAll(
    demoId: string,
    options: FindAssetsQuery,
  ): Promise<PageDto<Asset>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.asset.findMany({
        skip,
        take: options.take,
        where: {
          ...where,
          demoId,
        },
        orderBy: orderBy.length > 0 ? orderBy : [{ acquiredAt: 'desc' }],
      }),
      this.prisma.asset.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    demoId: string,
    options: FindAssetsCursorQuery,
  ): Promise<CursorPageDto<Asset>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.asset.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        ...where,
        demoId,
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }
}
