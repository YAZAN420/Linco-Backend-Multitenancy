import { Injectable } from '@nestjs/common';
import { QuestionsBankCommandRepository } from 'src/questionsBank/application/ports/questionsBank-command.repository';
import { QuestionsBank } from 'src/questionsBank/domain/questionsBank';
import { PrismaQuestionsBankMapper } from '../mappers/prisma-questionsBank.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaQuestionsBankCommandRepository implements QuestionsBankCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaQuestionsBankMapper,
  ) {}

  async save(questionBank: QuestionsBank): Promise<void> {
    const data = this.mapper.toPersistence(questionBank);
    await this.prisma.questionsBank.upsert({
      where: { id: questionBank.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.questionsBank.delete({ where: { id } });
  }

  async findById(id: string): Promise<QuestionsBank | null> {
    const questionsBank = await this.prisma.questionsBank.findUnique({
      where: { id },
    });
    return questionsBank ? this.mapper.toDomain(questionsBank) : null;
  }
}
