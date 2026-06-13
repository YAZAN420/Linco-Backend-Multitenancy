import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';
import { Name } from '../value-objects/name.vo';

@Injectable()
export class DemoFactory {
  createNew(name: string, ownerId: string): Demo {
    const now = new Date();
    const nameVo = Name.create(name);
    return new Demo(uuidv7(), {
      name: nameVo,
      ownerId,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
