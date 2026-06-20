import { Injectable } from '@nestjs/common';
import { QuestionsBankCommandRepository } from 'src/questionBanks/application/ports/questionsBank-command.repository';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { PrismaQuestionsBankMapper } from '../mappers/prisma-questionsBank.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaQuestionCoicesMapper } from '../mappers/prisma-question-choices.mapper';
import { updateLocale } from 'yargs';

@Injectable()
export class PrismaQuestionsBankCommandRepository implements QuestionsBankCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaQuestionsBankMapper,
    private readonly prismaQuestionCoicesMapper: PrismaQuestionCoicesMapper
  ) {}

  async save(questionBank: QuestionsBank): Promise<void> {
    const data = this.mapper.toPersistence(questionBank);
    const choicesData = questionBank.choices.map((choice) => {
      const data = this.prismaQuestionCoicesMapper.toPersistence(choice)
      return {
        id: data.id,
        text: data.text,
        isCorrect: data.isCorrect,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
    await this.prisma.questionsBank.upsert({
      where: { id: questionBank.id },
      include: {choices: true},
      update: {
        choices: {
          create: choicesData
        },
        ...data
      },
      create: {
        choices: {
          create: choicesData
        },
        ...data
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.questionsBank.delete({ where: { id } });
  }

  async findById(id: string): Promise<QuestionsBank | null> {
    const questionsBank = await this.prisma.questionsBank.findUnique({
      where: { id },
      include: {choices: true}
    });
    return questionsBank ? this.mapper.toDomain(questionsBank) : null;
  }
}
