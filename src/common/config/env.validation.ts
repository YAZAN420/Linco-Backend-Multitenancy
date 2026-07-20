import { plainToInstance, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  Min,
  IsOptional,
  IsBoolean,
  IsUrl,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(0)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  ACCESS_TOKEN_SECRET!: string;

  @IsString()
  REFRESH_TOKEN_SECRET!: string;

  @IsString()
  JWT_TOKEN_AUDIENCE!: string;

  @IsString()
  JWT_TOKEN_ISSUER!: string;

  @IsNumber()
  JWT_ACCESS_TOKEN_TTL!: number;

  @IsNumber()
  JWT_REFRESH_TOKEN_TTL!: number;

  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  GOOGLE_CLIENT_SECRET!: string;

  @IsString()
  GOOGLE_CALLBACK_URL!: string;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  RESEND_API_KEY!: string;

  @IsString()
  MAIL_FROM_ADDRESS!: string;

  @IsUrl({ require_tld: false })
  FRONTEND_URL!: string;

  @IsString()
  AZURE_STORAGE_ACCOUNT_NAME!: string;

  @IsString()
  AZURE_STORAGE_ACCOUNT_KEY!: string;

  @IsString()
  AZURE_STORAGE_CONTAINER_NAME!: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  AZURE_STORAGE_CDN_ENDPOINT?: string;

  @IsString()
  STRIPE_SECRET_KEY!: string;

  @IsString()
  STRIPE_WEBHOOK_SECRET!: string;

  @IsString()
  STRIPE_STARTER_PRICE_ID!: string;

  @IsString()
  STRIPE_PRO_PRICE_ID!: string;

  @IsString()
  STRIPE_ENTERPRISE_PRICE_ID!: string;

  @IsString()
  GEMINI_API_KEY!: string;

  @IsUrl({ require_tld: false })
  RagBaseUrl!: string;

  @IsString()
  JITSI_APP_ID!: string;

  @IsString()
  JITSI_KEY_ID!: string;

  @IsString()
  JITSI_PRIVATE_KEY!: string;

  @IsString()
  @IsOptional()
  CORS_ORIGINS?: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  })
  @IsBoolean()
  @IsOptional()
  REDIS_TLS: boolean = false;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  })
  @IsBoolean()
  @IsOptional()
  REDIS_TLS_REJECT_UNAUTHORIZED: boolean = true;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = errors
      .map((error) => {
        const constraints = Object.values(error.constraints || {}).join(', ');
        return `❌ [${error.property}]: ${constraints}`;
      })
      .join('\n');
    throw new Error(
      `\n⚠️  Environment Variables Validation Failed:\n${formattedErrors}\n`,
    );
  }
  return validatedConfig;
}
