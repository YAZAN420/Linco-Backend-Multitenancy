import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jitsiConfig from 'src/common/config/jitsi.config';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { Role } from 'src/users/domain/enums/role.enum';

@Injectable()
export class JitsiService {
  constructor(
    @Inject(jitsiConfig.KEY)
    private readonly jitsiConfigration: ConfigType<typeof jitsiConfig>,
  ) {}
  generateJitsiToken(user: ActiveUserData, roomName: string) {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = now + 7200;

    const isModerator = user.role === Role.ADMIN;

    const payload = {
      aud: 'jitsi',
      iss: 'jaas-components',
      sub: this.jitsiConfigration.appId,
      room: roomName,
      exp: expiresIn,
      nbf: now - 10,
      context: {
        features: {
          livestreaming: isModerator,
          recording: isModerator,
          transcription: true,
        },
        user: {
          id: user.id,
          name: '',
          email: user.email,
          avatar: '',
          moderator: isModerator,
        },
      },
    };

    try {
      const token = jwt.sign(payload, this.jitsiConfigration.privateKey!, {
        algorithm: 'RS256',
        header: {
          alg: 'RS256',
          kid: this.jitsiConfigration.keyId,
          typ: 'JWT',
        },
      });

      return {
        token,
        roomName,
        appId: this.jitsiConfigration.appId,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('errors.ERROR_GENERATING_JITSI_TOKEN');
    }
  }
}
