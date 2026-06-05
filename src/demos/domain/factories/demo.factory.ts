import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';
import { CreateDemoInput } from 'src/demos/application/interfaces/create-demo-input.interface';

@Injectable()
export class DemoFactory {
  createNew(input: CreateDemoInput): Demo {
    const now = new Date();
    return new Demo(uuidv7(), {
      name: input.name,
      ownerId: input.ownerId,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  reconstitute(
    id: string,
    props: {
      name: string;
      ownerId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ): Demo {
    return new Demo(id, { ...props, departments: [] });
  }
}
