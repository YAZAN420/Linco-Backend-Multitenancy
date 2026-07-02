import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { Invitation } from 'src/generated/prisma/client';
import { InvitationQueryRepository } from '../ports/invitation/invitation-query.repository';
import { FindCursorQuery } from 'src/common/interfaces/find.query';

@Injectable()
export class InvitationsQueryService {
  constructor(
    private readonly invitationQueryRepository: InvitationQueryRepository,
  ) {}

  async findAllCursor(
    receiverId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Invitation>> {
    return this.invitationQueryRepository.findAllCursor(receiverId, options);
  }

  async findById(id: string): Promise<Invitation> {
    const invitation = await this.invitationQueryRepository.findById(id);
    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }
}
