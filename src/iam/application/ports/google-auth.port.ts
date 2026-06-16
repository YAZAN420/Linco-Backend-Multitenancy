import { GoogleUserData } from 'src/iam/application/interfaces/google-user-data.interface';

export abstract class GoogleAuthPort {
  abstract verifyIdToken(idToken: string): Promise<GoogleUserData>;
}
