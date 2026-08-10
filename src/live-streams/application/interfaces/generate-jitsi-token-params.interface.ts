import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { JitsiParticipantRole } from './jitsi-participant-role.enum';

export interface GenerateJitsiTokenParams {
  roomName: string;
  user: ActiveUserData;
  role: JitsiParticipantRole;
}
