import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/common/config/jwt.config';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import type { JwtRequest } from './types/jwt-request.type';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly cls: ClsService<AppClsStore>,
  ) {
    const cookieExtractor = (req: JwtRequest): string | null =>
      req.cookies?.accessToken ?? null;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret!,
      issuer: jwtConfiguration.issuer,
      audience: jwtConfiguration.audience,
      passReqToCallback: true,
    });
  }

  validate(req: JwtRequest, payload: ActiveUserData) {
    if (this.cls.isActive()) {
      this.cls.set(CLS_KEYS.USER, payload);

      const demoId = req.headers['x-demo-id'];
      if (demoId) {
        this.cls.set(
          CLS_KEYS.DEMO_ID,
          Array.isArray(demoId) ? demoId[0] : demoId,
        );
      }

      const departmentId = req.headers['x-department-id'];
      if (departmentId) {
        this.cls.set(
          CLS_KEYS.DEPARTMENT_ID,
          Array.isArray(departmentId) ? departmentId[0] : departmentId,
        );
      }
    }
    return payload;
  }
}
