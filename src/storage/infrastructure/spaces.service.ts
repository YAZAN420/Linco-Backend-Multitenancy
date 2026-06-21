import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { StoragePort } from '../application/ports/storage.port';

@Injectable()
export class SpacesService implements StoragePort {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      //   endpoint: process.env.DO_SPACES_ORIGIN_ENDPOINT,
      //   region: process.env.DO_SPACES_REGION,
      //   credentials: {
      //     accessKeyId: process.env.DO_SPACES_KEY,
      //     secretAccessKey: process.env.DO_SPACES_SECRET,
      //   },
    });
  }

  async generateUploadUrl(
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; cdnUrl: string }> {
    const fileExtension = fileName.split('.').pop();
    const fileKey = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
    });

    const cdnUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileKey}`;

    return { uploadUrl, cdnUrl };
  }
}
