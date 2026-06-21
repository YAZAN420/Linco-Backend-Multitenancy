import { Injectable } from '@nestjs/common';
import { QuestionsBankResponseMapper } from 'src/questionBanks/presentation/http/mappers/questionBank-response.mapper';
import { RandomExam } from 'src/exams/domain/random-exam';
import { RandomExamResponseDto } from '../dto/random-exam-response.dto';

@Injectable()
export class ExamRandomResponseMapper {
  constructor(private readonly questionsBankResponseMapper:QuestionsBankResponseMapper) {}
  toResponseFromDomain(examAttempt: RandomExam): RandomExamResponseDto {
    return new RandomExamResponseDto(
      examAttempt.id,
      examAttempt.exam.title,
      examAttempt.exam.numberOfQuestions,
      examAttempt.exam.durationMinutes,
      examAttempt.questions.map((question) => this.questionsBankResponseMapper.toResponseFromDomain(question)),
      examAttempt.exam.sectionId,
      examAttempt.createdAt,
      examAttempt.updatedAt,
    );
  }
}
