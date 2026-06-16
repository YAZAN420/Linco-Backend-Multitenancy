import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthPort } from '../../application/ports/google-auth.port';
import { GoogleUserData } from '../../application/interfaces/google-user-data.interface';

@Injectable()
export class GoogleAuthAdapter implements GoogleAuthPort {
  private readonly googleOAuthClient = new OAuth2Client();

  async verifyIdToken(idToken: string): Promise<GoogleUserData> {
    const audience = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!audience)
      throw new UnauthorizedException('Google client ID is not configured');

    try {
      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken,
        audience,
      });
      const payload = ticket.getPayload();

      const email = payload?.email?.trim().toLowerCase();
      const emailVerified = payload?.email_verified === true;
      const providerId = payload?.sub;

      if (!email || !providerId || !emailVerified) {
        throw new UnauthorizedException('Invalid Google ID token payload');
      }

      return {
        email,
        firstName: payload.given_name?.trim() || email.split('@')[0],
        lastName: payload.family_name?.trim() || '',
        imagePath: payload.picture?.trim() ?? '',
        providerId,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }
}
