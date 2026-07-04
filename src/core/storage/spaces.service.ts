import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { ConfigType } from '@nestjs/config';
import storageConfig from 'src/common/config/storage.config';
import { GenerateUploadUrl } from './interfaces/generate-upload-url.interface';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import { StoragePort } from './storage.port';

@Injectable()
export class SpacesService implements StoragePort {
  private blobServiceClient: BlobServiceClient;
  private sharedKeyCredential: StorageSharedKeyCredential;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly config: ConfigType<typeof storageConfig>,
  ) {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.config.accountName!,
      this.config.accountKey!,
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${this.config.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
  }

  generateUploadUrl(
    fileName: string,
    contentType: string,
    isPublic: boolean,
    folder?: string,
  ): Promise<GenerateUploadUrl> {
    const ext = fileName.split('.').pop();
    const generatedKey = folder
      ? `${folder}/${uuidv4()}.${ext}`
      : `${uuidv4()}.${ext}`;

    const containerName = isPublic
      ? this.config.containerName!
      : 'private-uploads';

    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(generatedKey);

    const startsOn = new Date();
    const expiresOn = new Date(startsOn.valueOf() + 900 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: generatedKey,
        permissions: BlobSASPermissions.parse('cw'),
        startsOn,
        expiresOn,
        contentType,
      },
      this.sharedKeyCredential,
    ).toString();

    const uploadUrl = `${blockBlobClient.url}?${sasToken}`;
    const nativeAzureUrl = `https://${this.config.accountName}.blob.core.windows.net/${containerName}/${generatedKey}`;
    const baseCdn = this.config.cdnEndpoint?.replace(/\/$/, '');
    const cdnUrl = isPublic
      ? baseCdn
        ? `${baseCdn}/${containerName}/${generatedKey}`
        : nativeAzureUrl
      : null;

    return Promise.resolve({
      uploadUrl,
      fileKey: generatedKey,
      isPublic,
      cdnUrl,
    });
  }

  generateDownloadUrl(
    fileKey: string,
    isPublic: boolean = false,
  ): Promise<string> {
    const containerName = isPublic
      ? this.config.containerName!
      : 'private-uploads';
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);

    const startsOn = new Date();
    const expiresOn = new Date(startsOn.valueOf() + 300 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: fileKey,
        permissions: BlobSASPermissions.parse('r'),
        startsOn,
        expiresOn,
      },
      this.sharedKeyCredential,
    ).toString();

    return Promise.resolve(`${blockBlobClient.url}?${sasToken}`);
  }
}
