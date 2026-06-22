import { Inject, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { StoragePort } from './storage.port';
import type { ConfigType } from '@nestjs/config';
import storageConfig from 'src/common/config/storage.config';

@Injectable()
export class SpacesService implements StoragePort {
  private s3Client: S3Client;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConfiguration: ConfigType<typeof storageConfig>,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.storageConfiguration.originEndpoint!,
      region: this.storageConfiguration.region!,
      credentials: {
        accessKeyId: this.storageConfiguration.accessKey!,
        secretAccessKey: this.storageConfiguration.secretKey!,
      },
    });
  }

  async generateUploadUrl(
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; cdnUrl: string }> {
    const fileExtension = fileName.split('.').pop();
    const fileKey = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.storageConfiguration.bucketName!,
      Key: fileKey,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
    });

    const cdnUrl = `${this.storageConfiguration.cdnEndpoint!}/${fileKey}`;

    return { uploadUrl, cdnUrl };
  }
}
