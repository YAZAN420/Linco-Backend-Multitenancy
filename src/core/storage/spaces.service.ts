import { Inject, Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import type { ConfigType } from '@nestjs/config';
import storageConfig from 'src/common/config/storage.config';
import { GenerateUploadUrl } from './interfaces/generate-upload-url.interface';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
@Injectable()
export class SpacesService {
  private s3Client: S3Client;

  constructor(
    @Inject(storageConfig.KEY)
    private readonly config: ConfigType<typeof storageConfig>,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.config.originEndpoint!,
      region: this.config.region!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.accessKey!,
        secretAccessKey: this.config.secretKey!,
      },
    });
  }

  async generateUploadUrl(
    fileName: string,
    contentType: string,
    isPublic: boolean,
    folder?: string,
  ): Promise<GenerateUploadUrl> {
    const ext = fileName.split('.').pop();

    const fileKey = `${folder}/${uuidv4()}.${ext}`;

    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.config.bucketName!,
      Key: fileKey,
      Conditions: [
        ['eq', '$acl', isPublic ? 'public-read' : 'private'],
        ['eq', '$Content-Type', contentType],
      ],
      Fields: {
        acl: isPublic ? 'public-read' : 'private',
        'Content-Type': contentType,
      },
      Expires: 900,
    });

    return {
      uploadUrl: url,
      fields,
      fileKey,
      isPublic,
      cdnUrl: isPublic ? `${this.config.cdnEndpoint}/${fileKey}` : null,
    };
  }

  async generateDownloadUrl(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });
  }
}
