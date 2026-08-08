import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DomainException } from 'src/common/exceptions/domain.exception';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { FindQuestionsBankCursorQuery } from 'src/questionBanks/application/interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaQuestionsBankQueryRepository implements QuestionsBankQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>> {
    const { cursor, take } = options;

    const items = await this.prisma.questionsBank.findMany({
      where: {
        sectionId: sectionId,
      },
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      include: { choices: true },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async getRandomQuestions(
    sectionId: string,
    numberOfQuestions: number,
  ): Promise<QuestionsBankWithQuestionChoices[]> {
    const allIds = await this.prisma.questionsBank.findMany({
      where: { sectionId },
      select: { id: true },
    });

    if (numberOfQuestions > allIds.length) {
      throw new DomainException('errors.NOT_ENOUGH_QUESTIONS_AVAILABLE');
    }

    const shuffledIds = allIds
      .map((q) => q.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfQuestions);

    return await this.prisma.questionsBank.findMany({
      where: {
        id: { in: shuffledIds },
      },
      include: { choices: true },
    });
  }

  async findCorrectChoicesByQuestionIds(
    questionIds: string[],
  ): Promise<{ questionId: string; correctChoiceIds: string[] }[]> {
    const choices = await this.prisma.questionChoice.findMany({
      where: {
        questionId: { in: questionIds },
        isCorrect: true,
      },
      select: {
        questionId: true,
        id: true,
      },
    });

    const groupedCorrectChoices = new Map<string, string[]>();
    for (const choice of choices) {
      const existingIds = groupedCorrectChoices.get(choice.questionId) ?? [];
      existingIds.push(choice.id);
      groupedCorrectChoices.set(choice.questionId, existingIds);
    }

    return Array.from(groupedCorrectChoices.entries()).map(
      ([questionId, correctChoiceIds]) => ({
        questionId,
        correctChoiceIds,
      }),
    );
  }

  async findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices | null> {
    return await this.prisma.questionsBank.findUnique({
      where: { id, sectionId },
      include: { choices: true },
    });
  }

  async findByIdWithoutSection(
    id: string
  ): Promise<QuestionsBankWithQuestionChoices | null> {
    return await this.prisma.questionsBank.findUnique({
      where: { id },
      include: { 
        choices: true
      },
    });
  }
}
