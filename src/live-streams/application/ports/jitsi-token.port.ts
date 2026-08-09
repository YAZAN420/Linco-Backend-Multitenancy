import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

export enum JitsiParticipantRole {
  HOST = 'HOST',
  PARTICIPANT = 'PARTICIPANT',
}

export interface GenerateJitsiTokenParams {
  roomName: string;
  user: ActiveUserData;
  role: JitsiParticipantRole;
}

export interface JitsiTokenResult {
  token: string;
  roomName: string;
  appId: string;
}

export abstract class JitsiTokenPort {
  abstract generateToken(
    params: GenerateJitsiTokenParams,
  ): Promise<JitsiTokenResult>;
}
