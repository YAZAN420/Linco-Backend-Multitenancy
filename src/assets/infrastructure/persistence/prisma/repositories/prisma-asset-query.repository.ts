import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import {
  FindAssetsCursorQuery,
  FindAssetsQuery,
} from 'src/assets/application/interfaces/find-assets.query';
import { AssetQueryRepository } from 'src/assets/application/ports/asset-query.repository';
import { AssetWithCourse } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaAssetQueryRepository implements AssetQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    demoId: string,
    options: FindAssetsQuery,
  ): Promise<PageDto<AssetWithCourse>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.asset.findMany({
        skip,
        take: options.take,
        where: {
          demoId,
        },
        orderBy: [{ acquiredAt: 'desc' }],
        include: {
          course: {
            include: {
              demo: true,
              tags: true,
            },
          },
        },
      }),
      this.prisma.asset.count(),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    demoId: string,
    options: FindAssetsCursorQuery,
  ): Promise<CursorPageDto<AssetWithCourse>> {
    const { cursor, take } = options;

    const items = await this.prisma.asset.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        demoId,
      },
      orderBy: [{ id: 'desc' }],
      include: {
        course: {
          include: {
            demo: true,
            tags: true,
          },
        },
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<AssetWithCourse | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            demo: true,
            tags: true,
          },
        },
      },
    });
  }
}
