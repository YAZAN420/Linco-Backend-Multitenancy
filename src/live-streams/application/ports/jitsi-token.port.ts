import { GenerateJitsiTokenParams } from '../interfaces/generate-jitsi-token-params.interface';
import { JitsiTokenResult } from '../interfaces/jitsi-token-result.interface';

export abstract class JitsiTokenPort {
  abstract generateToken(
    params: GenerateJitsiTokenParams,
  ): Promise<JitsiTokenResult>;
}
