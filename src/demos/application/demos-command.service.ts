import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoCommandRepository } from './ports/demo-command.repository';
import { DemoFactory } from '../domain/factories/demo.factory';
import { Demo } from '../domain/demo';

import { CreateDemoInput } from './interfaces/create-demo-input.interface';
import { UpdateDemoInput } from './interfaces/update-demo-input.interface';
import { Name } from '../domain/value-objects/name.vo';

@Injectable()
export class DemosCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoFactory: DemoFactory,
  ) {}

  async create(input: CreateDemoInput): Promise<Demo> {
    const demo = this.demoFactory.createNew(input.name, input.ownerId);
    await this.demoCommandRepository.save(demo);
    return demo;
  }

  async update(id: string, input: UpdateDemoInput): Promise<Demo> {
    const demo = await this.findById(id);
    if (input.name !== undefined) {
      demo.updateName(Name.create(input.name));
    }
    await this.demoCommandRepository.save(demo);
    return demo;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.demoCommandRepository.delete(id);
  }

  async findById(id: string): Promise<Demo> {
    const demo = await this.demoCommandRepository.findById(id);
    if (!demo) throw new NotFoundException('demo not found');
    return demo;
  }
}
