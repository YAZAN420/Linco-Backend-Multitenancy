import { Injectable } from '@nestjs/common';

import { FcmTokenRepository } from '../../application/ports/fcm-token.repository.port';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaFcmTokenRepository implements FcmTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFcmToken(
    userId: string,
    token: string,
    deviceModel?: string,
  ): Promise<void> {
    await this.prisma.fcmToken.upsert({
      where: { token },
      update: { userId, deviceModel },
      create: { token, userId, deviceModel },
    });
  }

  async deleteFcmToken(userId: string, token: string): Promise<void> {
    await this.prisma.fcmToken.deleteMany({
      where: { userId, token },
    });
  }

  async findFcmTokensByUserId(userId: string): Promise<string[]> {
    const records = await this.prisma.fcmToken.findMany({
      where: { userId },
      select: { token: true },
    });
    return records.map((r) => r.token);
  }

  async deleteInvalidFcmTokens(tokens: string[]): Promise<void> {
    if (!tokens || tokens.length === 0) return;
    await this.prisma.fcmToken.deleteMany({
      where: { token: { in: tokens } },
    });
  }
}
