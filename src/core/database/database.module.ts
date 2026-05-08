import { Global, Module } from '@nestjs/common';
import { MongooseUnitOfWorkAdapter } from './mongoose-uow.adapter';
import { InMemoryUnitOfWorkAdapter } from './in-memory-uow.adapter';
import { UnitOfWorkPort } from './unit-of-work.port';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from 'src/config/database.config';
import { ConfigType } from '@nestjs/config';

@Global()
@Module({})
export class DatabaseModule {
  static use(driver: 'mongo' | 'memory') {
    const dbImports =
      driver === 'mongo'
        ? [
            MongooseModule.forRootAsync({
              useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
                uri: dbConfig.uri,
              }),
              inject: [databaseConfig.KEY],
            }),
          ]
        : [];

    return {
      module: DatabaseModule,
      imports: dbImports,
      providers: [
        {
          provide: UnitOfWorkPort,
          useClass:
            driver === 'memory'
              ? InMemoryUnitOfWorkAdapter
              : MongooseUnitOfWorkAdapter,
        },
      ],
      exports: [UnitOfWorkPort],
    };
  }
}
