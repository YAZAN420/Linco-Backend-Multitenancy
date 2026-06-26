import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';
import { Name } from '../value-objects/name.vo';

@Injectable()
export class DemoFactory {
  createNew(
    name: string,
    ownerId: string,
    imagePath: string,
    description: string,
  ): Demo {
    const now = new Date();
    const nameVo = Name.create(name);
    return new Demo(uuidv7(), {
      name: nameVo,
      imagePath,
      description,
      ownerId,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
