import { Module, Global } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { StoragePort } from './storage.port';

@Global()
@Module({
  providers: [
    {
      provide: StoragePort,
      useClass: SpacesService,
    },
  ],
  exports: [StoragePort],
})
export class StorageModule {}
