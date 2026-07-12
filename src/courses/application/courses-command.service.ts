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
import { CourseQueryRepository } from './ports/course-query.repository';
@Injectable()
export class CoursesCommandService {
  constructor(
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly courseFactory: CourseFactory,
    private readonly spacesService: StoragePort,
    private readonly aiRagService: AiRagService,
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

  async create(input: CreateCourseInput): Promise<Course> {
    const demoExists = await this.demoQueryRepository.demoExists(input.demoId);
    if (!demoExists) throw new NotFoundException('demo not found');

    const course = this.courseFactory.createNew(
      input.title,
      input.visibility,
      input.demoId,
      input.description,
      input.imagePath,
      input.price,
      input.tagIds,
    );

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

    // await this.aiRagService.createCourse([]);
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

    if (input.visibility !== undefined && input.visibility !== null) {
      course.updateVisibility(input.visibility);
    }

    if (input.tagIds !== undefined) {
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
    if (!course) throw new NotFoundException('course not found');
    return course;
  }
}
