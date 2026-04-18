import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.ACCESS_TOKEN_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '900', 10),
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10),
  accessCookieMaxAge:
    parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '900', 10) * 1000,
  refreshCookieMaxAge:
    parseInt(process.env.JWT_REFRESH_TOKEN_TTL ?? '86400', 10) * 1000,
  cookieSecure: process.env.NODE_ENV === 'production',
}));
