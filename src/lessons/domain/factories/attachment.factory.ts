import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Attachment } from '../attachment';
import { Title } from '../value-objects/title.vo';
import { FilePath } from '../../../common/value-objects/file-path.vo';

@Injectable()
export class AttachmentFactory {
  public createNew(
    lessonId: string,
    name: string,
    path: string,
    mimeType: string | null,
  ): Attachment {
    const now = new Date();
    const nameVo = Title.create(name);
    const pathVo = FilePath.create(path);
    return new Attachment(uuidv7(), {
      name: nameVo,
      path: pathVo,
      mimeType,
      lessonId: lessonId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
