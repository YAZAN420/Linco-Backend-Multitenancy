import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindAssetsCursorQuery,
  FindAssetsQuery,
} from '../interfaces/find-assets.query';
import { AssetWithCourse } from 'src/core/database/prisma/types';

export abstract class AssetQueryRepository {
  abstract findAll(
    demoId: string,
    options: FindAssetsQuery,
  ): Promise<PageDto<AssetWithCourse>>;
  abstract findAllCursor(
    demoId: string,
    options: FindAssetsCursorQuery,
  ): Promise<CursorPageDto<AssetWithCourse>>;
  abstract findById(id: string): Promise<AssetWithCourse | null>;
}
