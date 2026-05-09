import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export type DatabaseDriver = 'memory' | 'prisma';

@Global()
@Module({})
export class DatabaseModule {
  static use(driver: DatabaseDriver): DynamicModule {
    const providers: Provider[] = [];
    const exports: Provider[] = [];

    if (driver === 'prisma') {
      providers.push(PrismaService);
      exports.push(PrismaService);
    }

    return {
      module: DatabaseModule,
      providers,
      exports,
    };
  }
}
