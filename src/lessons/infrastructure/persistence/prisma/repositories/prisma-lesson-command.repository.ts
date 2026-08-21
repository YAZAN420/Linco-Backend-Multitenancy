import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LessonCommandRepository } from 'src/lessons/application/ports/lesson-command.repository';
import { Lesson } from 'src/lessons/domain/lesson';
import { PrismaLessonMapper } from '../mappers/prisma-lesson.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment.mapper';
import { Attachment } from 'src/lessons/domain/attachment';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaLessonCommandRepository implements LessonCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaLessonMapper,
    private readonly attachmentMapper: PrismaAttachmentMapper,
  ) {}

  async save(lesson: Lesson): Promise<void> {
    const data = this.mapper.toPersistence(lesson);
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.lesson.upsert({
          where: { id: lesson.id },
          update: data,
          create: data,
        });
        const attachmentIds = lesson.attachments.map((a) => a.id);
        await tx.attachment.deleteMany({
          where: {
            lessonId: lesson.id,
            id: { notIn: attachmentIds },
          },
        });
        for (const attachment of lesson.attachments) {
          const attachmentData =
            this.attachmentMapper.toPersistence(attachment);
          await tx.attachment.upsert({
            where: { id: attachment.id },
            update: attachmentData,
            create: attachmentData,
          });
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'errors.VALIDATION_FAILED_ONE_OF_THE_RELATED_ENTITIES_E_G_CATEGORY_INSTRUCTOR_OR_COURSE_REFERENCE_DOES_NOT_EXIST',
          );
        }
      }
      throw new InternalServerErrorException({
        message:
          'errors.DATABASE_OPERATION_FAILED_WHILE_SAVING_COURSE_AGGREGATE_ERROR',
        args: { error: String(error) },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.delete({ where: { id } });
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { attachments: true },
    });
    return lesson ? this.mapper.toDomain(lesson) : null;
  }

  async findAttachmentById(attachmentId: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
    });
    return attachment ? this.attachmentMapper.toDomain(attachment) : null;
  }
}
