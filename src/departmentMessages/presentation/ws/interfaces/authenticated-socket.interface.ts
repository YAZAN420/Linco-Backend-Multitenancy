import { Socket } from 'socket.io';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

interface SocketAuth {
  token: string;
}
export interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: SocketAuth;
  };
  data: {
    user: ActiveUserData;
    departmentId?: string;
    departmentMemberId?: string;
    role?: string;
  };
}
