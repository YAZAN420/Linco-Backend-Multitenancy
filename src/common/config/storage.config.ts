import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  cdnEndpoint: process.env.AZURE_STORAGE_CDN_ENDPOINT || null,
}));
