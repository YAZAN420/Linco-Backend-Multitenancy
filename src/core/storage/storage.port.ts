export abstract class StoragePort {
  abstract generateUploadUrl(
    fileKey: string,
    contentType: string,
    isPublic: boolean,
  ): Promise<{ uploadUrl: string }>;
}
