import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({})
export class DatabaseModule {
  static use(): DynamicModule {
    const providers: Provider[] = [];
    const exports: Provider[] = [];

    providers.push(PrismaService);
    exports.push(PrismaService);

    return {
      module: DatabaseModule,
      providers,
      exports,
    };
  }
}
