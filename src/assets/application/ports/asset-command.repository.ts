import { Asset } from 'src/assets/domain/asset';

export abstract class AssetCommandRepository {
  abstract save(asset: Asset): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Asset | null>;
}
