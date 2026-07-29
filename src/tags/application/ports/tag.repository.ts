import { Tag } from '../../domain/tag';

export abstract class TagRepository {
  abstract findAll(): Promise<Tag[]>;
  abstract findById(id: string): Promise<Tag | null>;
  abstract create(name: string): Promise<Tag>;
  abstract update(id: string, name: string): Promise<Tag>;
  abstract delete(id: string): Promise<void>;
  abstract existsByIds(ids: string[]): Promise<boolean>;
}
