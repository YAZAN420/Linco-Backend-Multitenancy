import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DiscussionAnswerCommandRepository } from 'src/discussionQuestions/application/ports/discussionAnswer-command.repository';
import { DiscussionAnswer } from 'src/discussionQuestions/domain/discussionAnswer';
import { PrismaDiscussionAnswerMapper } from '../mappers/prisma-discussionAnswer.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDiscussionAnswerCommandRepository implements DiscussionAnswerCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDiscussionAnswerMapper,
  ) {}

  async save(discussionAnswer: DiscussionAnswer): Promise<void> {
    const data = this.mapper.toPersistence(discussionAnswer);
    try {
      await this.prisma.discussionAnswer.upsert({
        where: { id: discussionAnswer.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException('errors.FOREIGN_KEY_CONSTRAINT_FAILED');
      }
      throw new InternalServerErrorException({
        message: 'errors.DATABASE_OPERATION_FAILED_ERROR',
        args: { error: String(error) },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.discussionAnswer.delete({ where: { id } });
  }

  async findById(id: string): Promise<DiscussionAnswer | null> {
    const discussionAnswer = await this.prisma.discussionAnswer.findUnique({
      where: { id },
    });
    return discussionAnswer ? this.mapper.toDomain(discussionAnswer) : null;
  }
}
