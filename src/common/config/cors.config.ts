export function getCorsOrigins(): string[] | boolean {
  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return corsOrigins.length > 0 ? corsOrigins : !isProduction;
}
