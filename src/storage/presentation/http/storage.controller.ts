import { Body, Controller, Post } from '@nestjs/common';
import { StoragePort } from '../../application/ports/storage.port';
import { GetPresignedUrlDto } from './dtos/get-presigned-url.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storagePort: StoragePort) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    return this.storagePort.generateUploadUrl(dto.fileName, dto.contentType);
  }
}
