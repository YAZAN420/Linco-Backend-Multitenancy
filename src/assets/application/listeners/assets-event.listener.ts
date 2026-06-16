import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CourseCreatedEvent } from 'src/common/events/course-created.event';
import { AssetsCommandService } from '../assets-command.service';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

@Injectable()
export class AssetsEventListener {
  constructor(private readonly assetsCommandService: AssetsCommandService) {}

  @OnEvent('course.created', { async: true })
  async handleCourseCreatedEvent(event: CourseCreatedEvent) {
    try {
      await this.assetsCommandService.create(event.demoId, {
        courseId: event.courseId,
        accessMethod: AccessMethod.CREATED,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
