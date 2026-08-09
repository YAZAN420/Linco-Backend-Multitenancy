import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jitsiConfig from 'src/common/config/jitsi.config';
import {
  GenerateJitsiTokenParams,
  JitsiParticipantRole,
  JitsiTokenPort,
  JitsiTokenResult,
} from 'src/live-streams/application/ports/jitsi-token.port';

@Injectable()
export class JaasJitsiTokenService implements JitsiTokenPort {
  constructor(
    @Inject(jitsiConfig.KEY)
    private readonly config: ConfigType<typeof jitsiConfig>,
  ) {}

  generateToken(params: GenerateJitsiTokenParams): Promise<JitsiTokenResult> {
    const now = Math.floor(Date.now() / 1000);
    const isHost = params.role === JitsiParticipantRole.HOST;
    try {
      const token = jwt.sign(
        {
          aud: 'jitsi',
          iss: 'jaas-components',
          sub: this.config.appId,
          room: params.roomName,
          nbf: now - 10,
          exp: now + 7200,
          context: {
            features: {
              livestreaming: isHost,
              recording: isHost,
              transcription: true,
            },
            user: {
              id: params.user.id,
              moderator: isHost,
              name: `${params.user.firstName} ${params.user.lastName}`,
            },
          },
        },
        this.config.privateKey!,
        {
          algorithm: 'RS256',
          header: { alg: 'RS256', kid: this.config.keyId, typ: 'JWT' },
        },
      );
      return Promise.resolve({
        token,
        roomName: params.roomName,
        appId: this.config.appId,
      });
    } catch {
      throw new InternalServerErrorException(
        'errors.ERROR_GENERATING_JITSI_TOKEN',
      );
    }
  }
}
