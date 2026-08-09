export enum JitsiParticipantRole {
  HOST = 'HOST',
  PARTICIPANT = 'PARTICIPANT',
}

export interface GenerateJitsiTokenParams {
  roomName: string;
  userId: string;
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
