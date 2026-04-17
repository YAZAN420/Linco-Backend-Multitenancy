import { User } from 'src/users/domain/user';
import { TokenPair } from './token-pair.interface';

export interface SignInResult {
  user: User;
  tokens: TokenPair;
}
