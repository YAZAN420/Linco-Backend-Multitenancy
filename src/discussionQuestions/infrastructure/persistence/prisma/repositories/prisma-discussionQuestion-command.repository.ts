import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DiscussionQuestionCommandRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-command.repository';
import { DiscussionQuestion } from 'src/discussionQuestions/domain/discussionQuestion';
import { PrismaDiscussionQuestionMapper } from '../mappers/prisma-discussionQuestion.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDiscussionQuestionCommandRepository implements DiscussionQuestionCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDiscussionQuestionMapper,
  ) {}

  async save(discussionQuestion: DiscussionQuestion): Promise<void> {
    const data = this.mapper.toPersistence(discussionQuestion);
    try {
      await this.prisma.discussionQuestion.upsert({
        where: { id: discussionQuestion.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('errors.DISCUSSION_QUESTION_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException(
        'errors.DATABASE_OPERATION_FAILED_ERROR',
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.discussionQuestion.delete({ where: { id } });
  }

  async findById(id: string): Promise<DiscussionQuestion | null> {
    const discussionQuestion = await this.prisma.discussionQuestion.findUnique({
      where: { id },
    });
    return discussionQuestion ? this.mapper.toDomain(discussionQuestion) : null;
  }
}
