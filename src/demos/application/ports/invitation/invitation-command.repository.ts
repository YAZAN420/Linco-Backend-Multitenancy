import { Invitation } from 'src/demos/domain/invitation';

export abstract class InvitationCommandRepository {
  abstract save(invitation: Invitation): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Invitation | null>;
  abstract findPending(
    demoId: string,
    receiverId: string,
  ): Promise<Invitation | null>;
}
