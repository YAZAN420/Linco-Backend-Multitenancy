import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindExamsCursorQuery,
  FindExamsQuery,
} from './interfaces/find-exams.query';
import { Exam } from 'src/generated/prisma/client';
import { ExamQueryRepository } from './ports/exam-query.repository';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';

@Injectable()
export class ExamsQueryService {
  constructor(
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly prismaCourseQueryRepository: PrismaCourseQueryRepository
  ) {}

  async findAll(sectionId: string, pageOptionsDto: FindExamsQuery): Promise<PageDto<Exam>> {
    await this.prismaCourseQueryRepository.findSectionById(sectionId);
    return this.examQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    sectionId: string, 
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    await this.prismaCourseQueryRepository.findSectionById(sectionId);
    
    return this.examQueryRepository.findAllCursor(options);
  }

  async findById(sectionId: string, id: string): Promise<Exam> {
    await this.prismaCourseQueryRepository.findSectionById(sectionId);

    const exam = await this.examQueryRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }
}
