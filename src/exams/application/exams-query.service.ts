import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindExamsCursorQuery,
  FindExamsQuery,
} from './interfaces/find-exams.query';
import { ExamQueryRepository } from './ports/exam-query.repository';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';
import { Exam } from '../domain/exam';

@Injectable()
export class ExamsQueryService {
  constructor(
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly sectionsQueryService: SectionsQueryService
  ) {}
  
  async findAll(sectionId: string, pageOptionsDto: FindExamsQuery): Promise<PageDto<Exam>> {
    await this.sectionsQueryService.exists(sectionId);
    return this.examQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    sectionId: string, 
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    await this.sectionsQueryService.exists(sectionId);
    
    return this.examQueryRepository.findAllCursor(options);
  }

  async findById(sectionId: string, id: string): Promise<Exam> {
    await this.sectionsQueryService.exists(sectionId);

    const exam = await this.examQueryRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async exists(examId: string): Promise<boolean> {
    const exam = await this.examQueryRepository.findById(examId);
    return !!exam;
  }
}
