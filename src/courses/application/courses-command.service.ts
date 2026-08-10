import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseCommandRepository } from './ports/course-command.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { Course } from '../domain/course';

import { CreateCourseInput } from './interfaces/create-course-input.interface';
import { UpdateCourseInput } from './interfaces/update-course-input.interface';
import { Title } from '../domain/value-objects/title.vo';
import { Price } from '../domain/value-objects/price.vo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CourseCreatedEvent } from 'src/common/events/course-created.event';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import { StoragePort } from 'src/core/storage/storage.port';
import { AiRagService } from 'src/core/ai-rag/ai-rag.service';
import { LessonQueryRepository } from 'src/lessons/application/ports/lesson-query.repository';
import { CreateCourseQuizInput } from './interfaces/create-course-quiz.input';
import { TagRepository } from 'src/tags/application/ports/tag.repository';
@Injectable()
export class CoursesCommandService {
  constructor(
    private readonly lessonQueryRepository: LessonQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly courseFactory: CourseFactory,
    private readonly spacesService: StoragePort,
    private readonly aiRagService: AiRagService,
    private readonly tagRepository: TagRepository,
  ) {}

  async generateDemoImageUploadUrl(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return await this.spacesService.generateUploadUrl(
      fileName,
      contentType,
      true,
      'courses',
    );
  }

  async generateSignatureImageUploadUrl(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return await this.spacesService.generateUploadUrl(
      fileName,
      contentType,
      true,
      'signatures',
    );
  }

  async create(input: CreateCourseInput): Promise<Course> {
    const demo = await this.demoQueryRepository.findById(input.demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    const course = this.courseFactory.createNew(
      input.title,
      input.visibility,
      input.demoId,
      input.description,
      input.imagePath,
      demo.signatureImagePath,
      input.price,
      input.tagIds,
    );

    const tagsExist = await this.tagRepository.existsByIds(course.tagIds);

    if (!tagsExist) {
      throw new NotFoundException('One or more tags do not exist.');
    }

    await this.courseCommandRepository.save(course);

    this.eventEmitter.emit(
      'course.created',
      new CourseCreatedEvent(input.demoId, course.id),
    );

    return course;
  }

  async publish(courseId: string): Promise<Course> {
    const course = await this.findById(courseId);

    course.publish();

    await this.courseCommandRepository.save(course);

    const videos = await this.lessonQueryRepository.findAllByCourseId(courseId);

    const formattedVideos = videos.map((lesson) => ({
      video_name: lesson.title,
      video_url: lesson.videoUrl,
    }));

    const rag = await this.aiRagService.createCourse({
      course_name: course.title,
      videos: formattedVideos,
    });
    console.log(rag);
    return course;
  }

  async update(courseId: string, input: UpdateCourseInput): Promise<Course> {
    const course = await this.findById(courseId);
    if (input.title !== undefined && input.title !== null) {
      const titleVo = Title.create(input.title);
      course.updateTitle(titleVo);
    }

    if (input.price !== undefined) {
      const priceVo = Price.create(input.price);
      course.updatePrice(priceVo);
    }

    if (input.description !== undefined) {
      course.updateDescription(input.description);
    }

    if (input.imagePath !== undefined) {
      course.updateImagePath(input.imagePath);
    }

    if (input.signatureImagePath !== undefined) {
      course.updateSignatureImagePath(input.signatureImagePath);
    }

    if (input.visibility !== undefined && input.visibility !== null) {
      course.updateVisibility(input.visibility);
    }

    if (input.tagIds !== undefined) {
      const tagsExist = await this.tagRepository.existsByIds(input.tagIds);

      if (!tagsExist) {
        throw new NotFoundException('One or more tags do not exist.');
      }

      course.updateTags(input.tagIds);
    }

    await this.courseCommandRepository.save(course);
    return course;
  }

  async remove(courseId: string): Promise<void> {
    await this.findById(courseId);
    await this.courseCommandRepository.delete(courseId);
  }

  async findById(courseId: string): Promise<Course> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');
    return course;
  }

  async askQuestionAboutCourse(courseId: string, question: string) {
    const course = await this.findById(courseId);
    return await this.aiRagService.askQuestion(course.title, question);
  }

  async generateQuizForCourse(courseId: string, dto: CreateCourseQuizInput) {
    const course = await this.findById(courseId);
    return await this.aiRagService.generateQuiz(
      course.title,
      dto.topic,
      dto.questionCount,
    );
  }
  async generateRandomQuizForCourse(courseId: string, questionCount: number) {
    const course = await this.findById(courseId);
    return await this.aiRagService.generateRandomQuiz(
      course.title,
      questionCount,
    );
  }
}
