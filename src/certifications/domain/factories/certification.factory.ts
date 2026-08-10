import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Certification } from '../certification';

@Injectable()
export class CertificationFactory {
  createNew(
    courseId: string,
    demoMemberId: string,
    score: number,
  ): Certification {
    const now = new Date();
    return new Certification(uuidv7(), {
      courseId,
      demoMemberId,
      score,
      issuedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }
}
