import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssetCommandRepository } from './ports/asset-command.repository';
import { AssetFactory } from '../domain/factories/asset.factory';
import { Asset } from '../domain/asset';

import { CreateAssetInput } from './interfaces/create-asset-input.interface';
import { UpdateAssetInput } from './interfaces/update-asset-input.interface';

import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { AccessMethod } from '../domain/enums/access-method.enum';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

@Injectable()
export class AssetsCommandService {
  constructor(
    private readonly assetCommandRepository: AssetCommandRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly assetFactory: AssetFactory,
  ) {}

  async create(demoId: string, input: CreateAssetInput): Promise<Asset> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    const course = await this.courseCommandRepository.findById(input.courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');

    const assetExist =
      await this.assetCommandRepository.findByCourseIdAndDemoId(
        course.id,
        demoId,
      );
    if (assetExist) {
      const message =
        input.accessMethod === AccessMethod.CREATED
          ? 'errors.COURSE_ALREADY_ASSIGNED_TO_THIS_DEMO'
          : 'errors.YOU_ALREADY_OWN_THIS_COURSE';
      throw new BadRequestException(message);
    }

    if (input.accessMethod === AccessMethod.PURCHASED) {
      if (!course.isPublished) {
        throw new BadRequestException(
          'errors.CANNOT_PURCHASE_AN_UNPUBLISHED_COURSE',
        );
      }
      if (course.visibility === CourseVisibility.PRIVATE) {
        throw new BadRequestException(
          'errors.CANNOT_PURCHASE_A_PRIVATE_COURSE_FROM_THE_MARKETPLACE',
        );
      }
    }

    const asset = this.assetFactory.createNew(
      demoId,
      input.courseId,
      input.accessMethod,
    );
    await this.assetCommandRepository.save(asset);
    return asset;
  }

  async update(
    demoId: string,
    assetId: string,
    input: UpdateAssetInput,
  ): Promise<Asset> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');
    const asset = await this.findById(assetId);
    if (input.accessMethod) asset.updateAccessMethod(input.accessMethod);
    await this.assetCommandRepository.save(asset);
    return asset;
  }

  async remove(demoId: string, assetId: string): Promise<void> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    await this.findById(assetId);
    await this.assetCommandRepository.delete(assetId);
  }

  private async findById(assetId: string): Promise<Asset> {
    const asset = await this.assetCommandRepository.findById(assetId);
    if (!asset) throw new NotFoundException('errors.ASSET_NOT_FOUND');
    return asset;
  }
}
