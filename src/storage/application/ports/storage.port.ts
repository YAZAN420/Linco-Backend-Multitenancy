export abstract class StoragePort {
  abstract generateUploadUrl(
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; cdnUrl: string }>;
}
