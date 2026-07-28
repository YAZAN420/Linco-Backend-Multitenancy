import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AssetCommandRepository } from 'src/assets/application/ports/asset-command.repository';
import { Asset } from 'src/assets/domain/asset';
import { PrismaAssetMapper } from '../mappers/prisma-asset.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
@Injectable()
export class PrismaAssetCommandRepository implements AssetCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaAssetMapper,
  ) {}

  async save(asset: Asset): Promise<void> {
    const data = this.mapper.toPersistence(asset);
    try {
      await this.prisma.asset.upsert({
        where: { id: asset.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('errors.ASSET_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException(
        'errors.DATABASE_OPERATION_FAILED_ERROR',
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.asset.delete({ where: { id } });
  }

  async findById(id: string): Promise<Asset | null> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    return asset ? this.mapper.toDomain(asset) : null;
  }

  async findByCourseIdAndDemoId(
    courseId: string,
    demoId: string,
  ): Promise<Asset | null> {
    const asset = await this.prisma.asset.findFirst({
      where: { courseId, demoId },
    });
    return asset ? this.mapper.toDomain(asset) : null;
  }
}
