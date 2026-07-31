import { Socket } from 'socket.io';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

export interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: { token?: string };
  };
  data: {
    user: ActiveUserData;
    departmentId?: string;
    role?: string;

    member?: {
      departmentMemberId: string;
      firstName: string;
      lastName: string;
      imagePath: string | null;
    };
  };
}
