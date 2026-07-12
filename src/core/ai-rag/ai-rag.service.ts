import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
  private readonly flaskBaseUrl = process.env.RagBaseUrl;

  constructor(private readonly httpService: HttpService) {}

  async getCourseStatus(courseName: string): Promise<AiStatusResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<AiStatusResponse>(
          `${this.flaskBaseUrl}/courses/${courseName}/status`,
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error);
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
          `${this.flaskBaseUrl}/courses`,
          courseData,
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error);
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
          `${this.flaskBaseUrl}/courses/${courseName}/ask`,
          { question },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to get answer from AI');
    }
  }

  async generateQuiz(courseName: string): Promise<AiQuizResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<AiQuizResponse>(
          `${this.flaskBaseUrl}/courses/${courseName}/quiz`,
          {},
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to generate quiz from AI');
    }
  }

  async getRandomQuiz(courseName: string): Promise<AiQuizResponse> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<AiQuizResponse>(
          `${this.flaskBaseUrl}/courses/${courseName}/random-quiz`,
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to get random quiz from AI',
      );
    }
  }
}
