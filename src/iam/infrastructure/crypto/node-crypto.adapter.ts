import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CryptoPort } from '../../application/ports/crypto.port';
import { IAM_CONSTANTS } from '../../domain/constants/iam.constants';

@Injectable()
export class NodeCryptoAdapter implements CryptoPort {
  generateSecureToken(): string {
    return crypto.randomBytes(IAM_CONSTANTS.TOKEN_BYTES).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
