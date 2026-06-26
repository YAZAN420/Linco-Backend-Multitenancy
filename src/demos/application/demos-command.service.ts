import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoCommandRepository } from './ports/demo-command.repository';
import { DemoFactory } from '../domain/factories/demo.factory';
import { Demo } from '../domain/demo';

import { CreateDemoInput } from './interfaces/create-demo-input.interface';
import { UpdateDemoInput } from './interfaces/update-demo-input.interface';
import { Name } from '../domain/value-objects/name.vo';
import { DemoMembersCommandService } from './demo-members-command.service';
import { DemoMemberRole } from '../domain/enums/demo-member-role.enum';
import { StoragePort } from 'src/core/storage/storage.port';

@Injectable()
export class DemosCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoMemberCommandService: DemoMembersCommandService,
    private readonly demoFactory: DemoFactory,
    private readonly spacesService: StoragePort,
  ) {}

  async generateDemoImageUploadUrl(fileName: string) {
    return await this.spacesService.generateUploadUrl(
      fileName,
      'image/png',
      true,
      'demos',
    );
  }

  async create(input: CreateDemoInput): Promise<Demo> {
    const demo = this.demoFactory.createNew(
      input.name,
      input.ownerId,
      input.imagePath,
      input.description,
    );
    await this.demoCommandRepository.save(demo);

    await this.demoMemberCommandService.addMember(demo.id, {
      userId: input.ownerId,
      role: DemoMemberRole.OWNER,
    });
    return demo;
  }

  async update(id: string, input: UpdateDemoInput): Promise<Demo> {
    const demo = await this.findById(id);
    if (input.name !== undefined) {
      demo.updateName(Name.create(input.name));
    }
    if (input.imagePath !== undefined) {
      demo.updateImagePath(input.imagePath);
    }
    if (input.description !== undefined) {
      demo.updateDescription(input.description);
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
