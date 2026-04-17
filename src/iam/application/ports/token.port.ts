import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { TokenPair } from '../../domain/interfaces/token-pair.interface';

@Injectable()
export abstract class TokenPort {
  abstract signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string>;
  abstract verifyToken<T extends object>(token: string): Promise<T>;
  abstract generateTokenPair(user: User): Promise<TokenPair>;
}
