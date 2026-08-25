import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CoursePublishedEvent } from '../../domain/events/course-published.event';
import { AiRagService } from 'src/core/ai-rag/ai-rag.service';
import { LessonQueryRepository } from 'src/lessons/application/ports/lesson-query.repository';

@Injectable()
export class CoursePublishedListener {
  private readonly logger = new Logger(CoursePublishedListener.name);

  constructor(
    private readonly lessonQueryRepository: LessonQueryRepository,
    private readonly aiRagService: AiRagService,
  ) {}

  @OnEvent('course.published', { async: true })
  async handleCoursePublished(event: CoursePublishedEvent): Promise<void> {
    try {
      const videos = await this.lessonQueryRepository.findAllByCourseId(
        event.courseId,
      );

      const formattedVideos = videos.map((lesson) => ({
        video_name: lesson.title,
        video_url: lesson.videoUrl,
      }));

      await this.aiRagService.createCourse({
        course_name: event.courseTitle,
        videos: formattedVideos,
      });

      this.logger.log(
        `Course [${event.courseTitle}] indexed successfully in AI RAG`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to index course [${event.courseTitle}] in AI RAG:`,
        error,
      );
    }
  }
}
