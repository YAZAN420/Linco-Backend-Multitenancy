import { Injectable } from '@nestjs/common';
import { StoragePort } from './storage.port';
import { MimeTypeResolver } from 'src/common/utils/mime-type.resolver';
import { GenerateUploadUrl } from './interfaces/generate-upload-url.interface';

@Injectable()
export class UploadUrlService {
  constructor(private readonly storagePort: StoragePort) {}

  async generateUrl(
    fileName: string,
    folder:
      | 'courses'
      | 'signatures'
      | 'avatars'
      | 'attachments'
      | 'demos'
      | 'lessons',
    isPublic = true,
  ): Promise<GenerateUploadUrl> {
    const contentType = MimeTypeResolver.getContentType(fileName);

    return await this.storagePort.generateUploadUrl(
      fileName,
      contentType,
      isPublic,
      folder,
    );
  }
}
