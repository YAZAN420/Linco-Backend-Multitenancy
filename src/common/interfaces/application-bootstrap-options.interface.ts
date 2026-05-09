import type { DatabaseDriver } from 'src/core/database/database.module';

export interface ApplicationBootstrapOptions {
  driver: DatabaseDriver;
}
