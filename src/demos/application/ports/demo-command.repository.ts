import { Demo } from 'src/demos/domain/demo';

export abstract class DemoCommandRepository {
  abstract save(demo: Demo): Promise<void>;
  abstract findById(id: string): Promise<Demo | null>;
}
