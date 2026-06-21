import { Module, Global } from '@nestjs/common';
import { StorageController } from './presentation/http/storage.controller';
import { SpacesService } from './infrastructure/spaces.service';
import { StoragePort } from './application/ports/storage.port';

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: StoragePort,
      useClass: SpacesService,
    },
  ],
  exports: [StoragePort],
})
export class StorageModule {}
