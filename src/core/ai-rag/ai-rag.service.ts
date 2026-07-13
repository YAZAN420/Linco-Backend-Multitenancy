import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  AiAnswerResponse,
  AiCourseResponse,
  AiQuizResponse,
  AiStatusResponse,
  CreateAiCourseInput,
} from './interfaces/ai-rag.interface';

@Injectable()
export class AiRagService {
  private readonly logger = new Logger(AiRagService.name);
  private readonly baseUrl = process.env.RagBaseUrl;

  constructor(private readonly httpService: HttpService) {}

  async getCourseStatus(courseName: string): Promise<AiStatusResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<AiStatusResponse>(
          `${this.baseUrl}/courses/${courseName}/status`,
        ),
      );
      return response.data;
    } catch (error) {
      this.logError('getCourseStatus', error);
      throw new InternalServerErrorException(
        'Failed to get course status from AI',
      );
    }
  }

  async createCourse(
    courseData: CreateAiCourseInput,
  ): Promise<AiCourseResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<AiCourseResponse>(
          `${this.baseUrl}/courses`,
          courseData,
        ),
      );
      return response.data;
    } catch (error) {
      this.logError('createCourse', error);
      throw new InternalServerErrorException('Failed to create course in AI');
    }
  }

  async askQuestion(
    courseName: string,
    question: string,
  ): Promise<AiAnswerResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<AiAnswerResponse>(
          `${this.baseUrl}/courses/${courseName}/ask`,
          { question },
        ),
      );
      return response.data;
    } catch (error) {
      this.logError('askQuestion', error);
      throw new InternalServerErrorException('Failed to get answer from AI');
    }
  }

  async generateQuiz(
    courseName: string,
    topic: string,
    questionCount: number,
  ): Promise<AiQuizResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<AiQuizResponse>(
          `${this.baseUrl}/courses/${courseName}/quiz`,
          {
            topic,
            num_questions: questionCount,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logError('generateQuiz', error);
      throw new InternalServerErrorException('Failed to generate quiz from AI');
    }
  }

  async generateRandomQuiz(
    courseName: string,
    questionCount: number,
  ): Promise<AiQuizResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<AiQuizResponse>(
          `${this.baseUrl}/courses/${courseName}/random-quiz`,
          {
            num_questions: questionCount,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logError('generateRandomQuiz', error);
      throw new InternalServerErrorException(
        'Failed to get random quiz from AI',
      );
    }
  }

  private logError(methodName: string, error: any) {
    this.logger.error(`Error in ${methodName}:`, JSON.stringify(error));
  }
}
