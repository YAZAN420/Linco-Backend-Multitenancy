import { Injectable } from '@nestjs/common';

import { FcmTokenRepository } from '../../application/ports/fcm-token.repository.port';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { v7 as uuidv7 } from 'uuid';

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
      create: { id: uuidv7(), token, userId, deviceModel },
    });
  }

  async deleteFcmToken(userId: string, token: string): Promise<void> {
    await this.prisma.fcmToken.deleteMany({
      where: { userId, token },
    });
  }

  async findFcmTokensByUserId(userId: string): Promise<string[]> {
    console.log('repo ', userId);
    const records = await this.prisma.fcmToken.findMany({
      where: { userId },
      select: { token: true },
    });
    console.log(records);
    return records.map((r) => r.token);
  }

  async deleteInvalidFcmTokens(tokens: string[]): Promise<void> {
    if (!tokens || tokens.length === 0) return;
    await this.prisma.fcmToken.deleteMany({
      where: { token: { in: tokens } },
    });
  }
}
