import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { InvitationQueryRepository } from '../ports/invitation/invitation-query.repository';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { InvitationWithUserAndDemo } from 'src/core/database/prisma/types';

@Injectable()
export class InvitationsQueryService {
  constructor(
    private readonly invitationQueryRepository: InvitationQueryRepository,
  ) {}

  async findAllCursor(
    receiverId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<InvitationWithUserAndDemo>> {
    return this.invitationQueryRepository.findAllCursor(receiverId, options);
  }

  async findById(id: string): Promise<InvitationWithUserAndDemo> {
    const invitation = await this.invitationQueryRepository.findById(id);
    if (!invitation) throw new NotFoundException('errors.INVITATION_NOT_FOUND');
    return invitation;
  }
}
