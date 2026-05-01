import { Request } from 'express';

export type JwtRequest = Request & {
  cookies?: {
    accessToken?: string;
  };
  auth?: {
    token?: string;
  };
};
