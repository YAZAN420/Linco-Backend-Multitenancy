import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  Min,
  IsOptional,
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
  JWT_TOKEN_AUDIENCE!: string;

  @IsString()
  JWT_TOKEN_ISSUER!: string;

  @IsNumber()
  JWT_ACCESS_TOKEN_TTL!: number;

  @IsNumber()
  JWT_REFRESH_TOKEN_TTL!: number;

  @IsString()
  SMTP_HOST!: string;

  @IsNumber()
  SMTP_PORT!: number;

  @IsString()
  SMTP_USER!: string;

  @IsString()
  SMTP_PASS!: string;

  @IsString()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  GOOGLE_CLIENT_SECRET!: string;

  @IsString()
  GOOGLE_CALLBACK_URL!: string;
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
