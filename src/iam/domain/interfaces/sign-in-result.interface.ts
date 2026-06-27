import { User } from 'src/users/domain/user';
import { TokenPair } from './token-pair.interface';

export interface SignInResult {
  requires2FA: boolean;
  user?: User;
  tokens?: TokenPair;
  twoFactorToken?: string;
}
