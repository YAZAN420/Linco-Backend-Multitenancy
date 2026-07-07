import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AssetsCommandService } from 'src/assets/application/assets-command.service';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

@Injectable()
export class CoursePurchaseListener {
  constructor(private readonly assetsCommandService: AssetsCommandService) {}

  @OnEvent('course.purchased')
  async handleCoursePurchasedEvent(payload: {
    userId: string;
    courseId: string;
    demoId: string;
    isFree: boolean;
  }) {
    try {
      await this.assetsCommandService.create(payload.demoId, {
        courseId: payload.courseId,
        accessMethod: AccessMethod.PURCHASED,
      });
      console.log(
        `[Asset Created] Course ${payload.courseId} successfully linked to demo ${payload.demoId}`,
      );
    } catch (error) {
      console.error(`Failed to automatically add course to assets: ${error}`);
    }
  }
}
