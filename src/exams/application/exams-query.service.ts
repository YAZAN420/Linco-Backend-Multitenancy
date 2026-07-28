import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindExamsCursorQuery } from './interfaces/find-exams.query';
import { ExamQueryRepository } from './ports/exam-query.repository';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';
import { Exam } from '../domain/exam';

@Injectable()
export class ExamsQueryService {
  constructor(
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly sectionsQueryService: SectionsQueryService,
  ) {}

  async findAllCursor(
    sectionId: string,
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    const sectionExist = await this.sectionsQueryService.exists(sectionId);

    if (!sectionExist) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    return this.examQueryRepository.findAllCursor(sectionId, options);
  }

  async findById(sectionId: string, id: string): Promise<Exam> {
    const sectionExist = await this.sectionsQueryService.exists(sectionId);

    if (!sectionExist) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const exam = await this.examQueryRepository.findById(id);
    if (!exam) throw new NotFoundException('errors.EXAM_NOT_FOUND');

    return exam;
  }

  async exists(examId: string): Promise<boolean> {
    const exam = await this.examQueryRepository.findById(examId);
    return !!exam;
  }
}
