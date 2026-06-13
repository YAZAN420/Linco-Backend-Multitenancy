import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';

@Injectable()
export class DemoFactory {
  createNew(name: string, ownerId: string): Demo {
    const now = new Date();
    return new Demo(uuidv7(), {
      name,
      ownerId,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
