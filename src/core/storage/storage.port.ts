import { GenerateUploadUrl } from './interfaces/generate-upload-url.interface';

export abstract class StoragePort {
  abstract generateUploadUrl(
    fileName: string,
    contentType: string,
    isPublic: boolean,
    folder?: string,
    expiresInMinutes?: number,
  ): Promise<GenerateUploadUrl>;

  abstract generateDownloadUrl(
    fileKey: string,
    isPublic: boolean,
  ): Promise<string>;
}
