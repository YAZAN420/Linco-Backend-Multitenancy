import { Module, Global } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { StoragePort } from './storage.port';
import { UploadUrlService } from './upload-url.service';

@Global()
@Module({
  providers: [
    UploadUrlService,
    {
      provide: StoragePort,
      useClass: SpacesService,
    },
  ],
  exports: [StoragePort, UploadUrlService],
})
export class StorageModule {}
