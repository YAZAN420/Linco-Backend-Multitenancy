import { Injectable, NotFoundException } from '@nestjs/common';
import { AiRagService } from 'src/core/ai-rag/ai-rag.service';
import { CourseCommandRepository } from './ports/course-command.repository';
import { CreateCourseQuizInput } from './interfaces/create-course-quiz.input';

@Injectable()
export class CourseAiService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly aiRagService: AiRagService,
  ) {}

  async askQuestion(courseId: string, question: string) {
    const course = await this.findCourse(courseId);
    return await this.aiRagService.askQuestion(course.title, question);
  }

  async generateQuiz(courseId: string, dto: CreateCourseQuizInput) {
    const course = await this.findCourse(courseId);
    return await this.aiRagService.generateQuiz(
      course.title,
      dto.topic,
      dto.questionCount,
    );
  }

  async generateRandomQuiz(courseId: string, questionCount: number) {
    const course = await this.findCourse(courseId);
    return await this.aiRagService.generateRandomQuiz(
      course.title,
      questionCount,
    );
  }

  private async findCourse(courseId: string) {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');
    return course;
  }
}
