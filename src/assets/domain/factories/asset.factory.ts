import { Injectable } from '@nestjs/common';
import { Asset } from '../asset';
import { v7 as uuidv7 } from 'uuid';
import { AccessMethod } from '../enums/access-method.enum';

@Injectable()
export class AssetFactory {
  public createNew(
    demoId: string,
    courseId: string,
    accessMethod: AccessMethod,
  ): Asset {
    const now = new Date();
    return new Asset(uuidv7(), {
      demoId,
      courseId,
      accessMethod,
      acquiredAt: now,
      updatedAt: now,
    });
  }
}
