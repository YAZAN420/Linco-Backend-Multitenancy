import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationCommandRepository } from '../ports/invitation/invitation-command.repository';
import { InvitationFactory } from '../../domain/factories/invitation.factory';
import { CreateInvitationInput } from './interfaces/create-department-member-input.interface';
import { Invitation } from 'src/demos/domain/invitation';
import { InvitationStatus } from 'src/demos/domain/enums/invitation-status.enum';
import { DemoMemberCommandRepository } from '../ports/demo-member/demo-member-command.repository';
import { DemoMemberFactory } from 'src/demos/domain/factories/demo-member.factory';

@Injectable()
export class InvitationsCommandService {
  constructor(
    private readonly invitationCommandRepository: InvitationCommandRepository,
    private readonly invitationFactory: InvitationFactory,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly demoMemberFactory: DemoMemberFactory,
  ) {}

  async create(input: CreateInvitationInput): Promise<Invitation> {
    const existingMember =
      await this.demoMemberCommandRepository.findByDemoAndUser(
        input.demoId,
        input.receiverId,
      );
    if (existingMember)
      throw new ConflictException('User is already a member of this demo');

    const existingPending = await this.invitationCommandRepository.findPending(
      input.demoId,
      input.receiverId,
    );
    if (existingPending)
      throw new ConflictException(
        'A pending invitation already exists for this user',
      );

    const invitation = this.invitationFactory.createNew(
      input.demoId,
      input.senderId,
      input.receiverId,
      input.role,
    );
    await this.invitationCommandRepository.save(invitation);
    return invitation;
  }

  async accept(invitationId: string, currentUserId: string): Promise<void> {
    const invitation = await this.findById(invitationId);

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('Invitation is no longer pending');
    }

    if (invitation.receiverId !== currentUserId) {
      throw new ForbiddenException(
        'You are not authorized to accept this invitation',
      );
    }

    invitation.updateStatus(InvitationStatus.ACCEPTED);
    await this.invitationCommandRepository.save(invitation);

    const member = this.demoMemberFactory.createNew(
      invitation.demoId,
      invitation.receiverId,
      invitation.role,
    );
    await this.demoMemberCommandRepository.save(member);
  }

  async reject(invitationId: string, currentUserId: string): Promise<void> {
    const invitation = await this.findById(invitationId);

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('Invitation is no longer pending');
    }

    if (invitation.receiverId !== currentUserId) {
      throw new ForbiddenException(
        'You are not authorized to reject this invitation',
      );
    }

    invitation.updateStatus(InvitationStatus.REJECTED);
    await this.invitationCommandRepository.save(invitation);
  }

  async remove(invitationId: string): Promise<void> {
    await this.findById(invitationId);
    await this.invitationCommandRepository.delete(invitationId);
  }

  async findById(invitationId: string): Promise<Invitation> {
    const invitation =
      await this.invitationCommandRepository.findById(invitationId);
    if (!invitation) throw new NotFoundException('invitation not found');
    return invitation;
  }
}
