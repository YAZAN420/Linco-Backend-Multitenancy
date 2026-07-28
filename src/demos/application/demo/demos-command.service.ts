import { Injectable, NotFoundException } from '@nestjs/common';

import { StoragePort } from 'src/core/storage/storage.port';
import { DemoCommandRepository } from '../ports/demo/demo-command.repository';
import { DemoMembersCommandService } from '../demo-member/demo-members-command.service';
import { DemoFactory } from 'src/demos/domain/factories/demo.factory';
import { CreateDemoInput } from './interfaces/create-demo-input.interface';
import { Demo } from 'src/demos/domain/demo';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { UpdateDemoInput } from './interfaces/update-demo-input.interface';
import { Name } from 'src/demos/domain/value-objects/name.vo';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { DomainException } from 'src/common/exceptions/domain.exception';

@Injectable()
export class DemosCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoMemberCommandService: DemoMembersCommandService,
    private readonly demoFactory: DemoFactory,
    private readonly spacesService: StoragePort,
  ) {}

  async generateDemoImageUploadUrl(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    return await this.spacesService.generateUploadUrl(
      fileName,
      contentType,
      true,
      'demos',
    );
  }

  async activateDemoSubscription(
    userId: string,
    demoId: string,
    plan: PlanTier,
    stripeSubscriptionId: string,
    currentPeriodEnd: Date,
  ) {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('errors.DEMO_WORKSPACE_WITH_ID_DEMO_ID_NOT_FOUND');
    }
    demo.updatePlan(plan);
    demo.activateSubscription(stripeSubscriptionId, currentPeriodEnd);
    await this.demoCommandRepository.save(demo);
  }

  async create(input: CreateDemoInput): Promise<Demo> {
    const existingDemo = await this.demoCommandRepository.findByOwnerId(
      input.ownerId,
    );

    if (existingDemo) {
      throw new DomainException('errors.YOU_HAVE_ALREADY_USED_YOUR_FREE_TRIAL_LIMIT');
    }

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

  async expireFinishedTrials(): Promise<void> {
    await this.demoCommandRepository.updateExpiredTrials();
  }

  async findById(id: string): Promise<Demo> {
    const demo = await this.demoCommandRepository.findById(id);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');
    return demo;
  }
}
