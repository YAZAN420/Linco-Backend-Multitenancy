import { GenerateUploadUrl } from './interfaces/generate-upload-url.interface';

export abstract class StoragePort {
  abstract generateUploadUrl(
    fileKey: string,
    contentType: string,
    isPublic: boolean,
    folder?: string,
  ): Promise<GenerateUploadUrl>;
}
