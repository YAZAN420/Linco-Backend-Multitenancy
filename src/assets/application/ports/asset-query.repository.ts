import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindAssetsCursorQuery,
  FindAssetsQuery,
} from '../interfaces/find-assets.query';
import { Asset } from 'src/generated/prisma/client';

export abstract class AssetQueryRepository {
  abstract findAll(
    demoId: string,
    options: FindAssetsQuery,
  ): Promise<PageDto<Asset>>;
  abstract findAllCursor(
    demoId: string,
    options: FindAssetsCursorQuery,
  ): Promise<CursorPageDto<Asset>>;
  abstract findById(id: string): Promise<Asset | null>;
}
