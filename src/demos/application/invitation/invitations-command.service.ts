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
import { DemoCommandRepository } from '../ports/demo/demo-command.repository';

@Injectable()
export class InvitationsCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly invitationCommandRepository: InvitationCommandRepository,
    private readonly invitationFactory: InvitationFactory,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly demoMemberFactory: DemoMemberFactory,
  ) {}

  async create(input: CreateInvitationInput): Promise<Invitation> {
    const demoExists = await this.demoCommandRepository.findById(input.demoId);
    if (!demoExists) {
      throw new NotFoundException(
        'errors.DEMO_WITH_ID_DEMO_ID_DOES_NOT_EXIST',
      );
    }
    const existingMember =
      await this.demoMemberCommandRepository.findByDemoAndUser(
        input.demoId,
        input.receiverId,
      );
    if (existingMember)
      throw new ConflictException('errors.USER_IS_ALREADY_A_MEMBER_OF_THIS_DEMO');

    const existingPending = await this.invitationCommandRepository.findPending(
      input.demoId,
      input.receiverId,
    );
    if (existingPending)
      throw new ConflictException(
        'errors.A_PENDING_INVITATION_ALREADY_EXISTS_FOR_THIS_USER',
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

    if (invitation.receiverId !== currentUserId) {
      throw new ForbiddenException(
        'errors.YOU_ARE_NOT_AUTHORIZED_TO_ACCEPT_THIS_INVITATION',
      );
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('errors.INVITATION_IS_NO_LONGER_PENDING');
    }

    const memberExists =
      await this.demoMemberCommandRepository.findByDemoAndUser(
        invitation.demoId,
        invitation.receiverId,
      );

    if (memberExists) {
      throw new ConflictException('errors.USER_IS_ALREADY_A_MEMBER_OF_THIS_DEMO');
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
      throw new ConflictException('errors.INVITATION_IS_NO_LONGER_PENDING');
    }

    if (invitation.receiverId !== currentUserId) {
      throw new ForbiddenException(
        'errors.YOU_ARE_NOT_AUTHORIZED_TO_REJECT_THIS_INVITATION',
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
    if (!invitation) throw new NotFoundException('errors.INVITATION_NOT_FOUND');
    return invitation;
  }
}
