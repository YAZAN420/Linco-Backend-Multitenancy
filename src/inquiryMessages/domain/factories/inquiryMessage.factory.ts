import { Injectable } from '@nestjs/common';
import { InquiryMessage } from '../inquiryMessage';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class InquiryMessageFactory {
  public createNew(
    senderId: string,
    inquiryId: string,
    message: string,
  ): InquiryMessage {
    const now = new Date();
    return new InquiryMessage(uuidv7(), {
      senderId: senderId,
      inquiryId: inquiryId,
      message: message,
      createdAt: now,
      updatedAt: now,
    });
  }
}
