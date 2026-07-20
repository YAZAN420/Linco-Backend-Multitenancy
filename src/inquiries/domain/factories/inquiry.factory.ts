import { Injectable } from '@nestjs/common';
import { Inquiry } from '../inquiry';
import { v7 as uuidv7 } from 'uuid';
import { InquiryStatus } from '../enums/inqurity-status.enum';

@Injectable()
export class InquiryFactory {
  public createNew(
    subject: string,
    creatorId: string,
    demoId: string,
  ): Inquiry {
    const now = new Date();
    return new Inquiry(uuidv7(), {
      subject: subject,
      demoId: demoId,
      creatorId: creatorId,
      status: InquiryStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }
}
