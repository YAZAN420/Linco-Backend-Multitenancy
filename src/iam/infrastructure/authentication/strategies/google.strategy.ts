import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { ConfigType } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
import type { StrategyOptions } from 'passport-google-oauth20';
import googleOAuthConfig from 'src/common/config/google-oauth.config';
import { GoogleUserData } from 'src/iam/application/interfaces/google-user-data.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOAuthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOAuthConfig>,
  ) {
    const options: StrategyOptions = {
      clientID: googleConfiguration.clientId!,
      clientSecret: googleConfiguration.clientSecret!,
      callbackURL: googleConfiguration.callbackUrl!,
      scope: ['email', 'profile'],
    };

    super(options);
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): GoogleUserData {
    const email = profile.emails?.[0]?.value?.trim().toLowerCase();
    if (!email) {
      throw new UnauthorizedException(
        'errors.GOOGLE_ACCOUNT_DOES_NOT_PROVIDE_A_VALID_EMAIL',
      );
    }

    const firstName =
      profile.name?.givenName?.trim() ||
      profile.displayName?.trim() ||
      email.split('@')[0];

    const lastName = profile.name?.familyName?.trim() || '';

    const imagePath = profile.photos?.[0]?.value?.trim() ?? '';

    return {
      email,
      firstName,
      lastName,
      imagePath,
      providerId: profile.id,
    };
  }
}
