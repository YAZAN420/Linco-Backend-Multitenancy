import { AssetFilter } from './asset-filter.interface';

export interface FindAssetsQuery extends AssetFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindAssetsCursorQuery extends AssetFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
