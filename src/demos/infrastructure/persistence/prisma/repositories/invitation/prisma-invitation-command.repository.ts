import { Injectable } from '@nestjs/common';
import { InvitationCommandRepository } from 'src/demos/application/ports/invitation/invitation-command.repository';
import { Invitation } from 'src/demos/domain/invitation';
import { PrismaInvitationMapper } from '../../mappers/prisma-invitation.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { InvitationStatus } from 'src/generated/prisma/enums';

@Injectable()
export class PrismaInvitationCommandRepository implements InvitationCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaInvitationMapper,
  ) {}

  async save(invitation: Invitation): Promise<void> {
    const data = this.mapper.toPersistence(invitation);
    await this.prisma.invitation.upsert({
      where: { id: invitation.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.invitation.delete({ where: { id } });
  }

  async findById(id: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });
    return invitation ? this.mapper.toDomain(invitation) : null;
  }

  async findPending(
    demoId: string,
    receiverId: string,
  ): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findFirst({
      where: { demoId, receiverId, status: InvitationStatus.PENDING },
    });
    return invitation ? this.mapper.toDomain(invitation) : null;
  }
}
