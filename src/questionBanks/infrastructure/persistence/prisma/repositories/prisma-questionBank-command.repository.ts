import { Injectable } from '@nestjs/common';
import { QuestionsBankCommandRepository } from 'src/questionBanks/application/ports/questionsBank-command.repository';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { PrismaQuestionsBankMapper } from '../mappers/prisma-questionsBank.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaQuestionChoicesMapper } from '../mappers/prisma-question-choices.mapper';

@Injectable()
export class PrismaQuestionsBankCommandRepository implements QuestionsBankCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaQuestionsBankMapper,
    private readonly prismaQuestionCoicesMapper: PrismaQuestionChoicesMapper,
  ) {}

  async save(questionBank: QuestionsBank): Promise<void> {
    const data = this.mapper.toPersistence(questionBank);

    const choicesData = questionBank.choices.map((choice) => {
      const choiceData = this.prismaQuestionCoicesMapper.toPersistence(choice);
      return {
        id: choiceData.id,
        text: choiceData.text,
        isCorrect: choiceData.isCorrect,
        createdAt: choiceData.createdAt,
        updatedAt: choiceData.updatedAt,
      };
    });

    await this.prisma.questionsBank.create({
      data: {
        ...data,
        choices: {
          create: choicesData,
        },
      },
    });
  }

  async delete(sectionId: string, id: string): Promise<void> {
    await this.prisma.questionsBank.delete({ where: { id, sectionId } });
  }

  async findById(sectionId: string, id: string): Promise<QuestionsBank | null> {
    const questionsBank = await this.prisma.questionsBank.findFirst({
      where: { id, sectionId },
      include: { choices: true },
    });
    return questionsBank ? this.mapper.toDomain(questionsBank) : null;
  }
}
