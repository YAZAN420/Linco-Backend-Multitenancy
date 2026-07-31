import { Injectable } from '@nestjs/common';
import { InquiryReply } from '../inquiryReply';
import { v7 as uuidv7 } from 'uuid';
import { InquirySenderType } from '../enums/InquirySenderType';

@Injectable()
export class InquiryReplyFactory {
  public createNew(message: string, senderType: InquirySenderType, senderId: string, inquiryId: string): InquiryReply {
    const now = new Date();
    return new InquiryReply(uuidv7(),{ 
      message: message,
      senderId: senderId,
      senderType: senderType,
      inquiryId: inquiryId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
