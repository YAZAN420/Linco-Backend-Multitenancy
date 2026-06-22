import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  accessKey: process.env.DO_SPACES_KEY,
  secretKey: process.env.DO_SPACES_SECRET,
  region: process.env.DO_SPACES_REGION,
  originEndpoint: process.env.DO_SPACES_ORIGIN_ENDPOINT,
  bucketName: process.env.DO_SPACES_BUCKET_NAME,
  cdnEndpoint: process.env.DO_SPACES_CDN_ENDPOINT,
}));
