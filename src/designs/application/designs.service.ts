import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { StoragePort } from 'src/core/storage/storage.port';
import { Prisma } from 'src/generated/prisma/client';
import { CreateDesignDto } from '../presentation/http/dto/create-design.dto';
import { UpdateDesignDto } from '../presentation/http/dto/update-design.dto';
import { DesignFileValidator, DesignUploadFile } from './design-file.validator';

const includeAssets = { sourceAsset: true, currentAsset: true } as const;
type DesignWithAssets = Prisma.DesignGetPayload<{
  include: typeof includeAssets;
}>;
type DesignAssetResponseSource = NonNullable<DesignWithAssets['sourceAsset']>;

@Injectable()
export class DesignsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StoragePort,
    private readonly files: DesignFileValidator,
  ) {}

  async create(userId: string, dto: CreateDesignDto) {
    let sourceAsset: { id: string } | null = null;
    if (dto.sourceAssetId) {
      sourceAsset = await this.prisma.designAsset.findFirst({
        where: { id: dto.sourceAssetId, ownerId: userId },
        select: { id: true },
      });
      if (!sourceAsset)
        throw new ForbiddenException('errors.DESIGN_SOURCE_ASSET_FORBIDDEN');
    }
    return this.prisma.design.create({
      data: {
        userId,
        name: dto.name?.trim() || 'Untitled design',
        sourceAssetId: sourceAsset?.id,
        currentAssetId: sourceAsset?.id,
      },
      include: includeAssets,
    });
  }

  async findAll(userId: string, page: number, limit: number) {
    const where = { userId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.design.findMany({
        where,
        include: includeAssets,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.design.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(userId: string, id: string) {
    const design = await this.prisma.design.findFirst({
      where: { id, userId },
      include: includeAssets,
    });
    if (!design) throw new NotFoundException('errors.DESIGN_NOT_FOUND');
    return design;
  }

  async update(userId: string, id: string, dto: UpdateDesignDto) {
    await this.findOne(userId, id);
    return this.prisma.design.update({
      where: { id },
      data: { ...(dto.name !== undefined && { name: dto.name.trim() }) },
      include: includeAssets,
    });
  }

  async export(userId: string, id: string, file?: DesignUploadFile) {
    const design = await this.findOne(userId, id);
    const valid = this.files.validate(file);
    const fileKey = `designs/${userId}/${randomUUID()}.${valid.extension}`;
    await this.storage.upload(fileKey, file!.buffer, valid.mimeType, false);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const asset = await tx.designAsset.create({
          data: {
            designId: id,
            ownerId: userId,
            sourceAssetId: design.currentAssetId ?? design.sourceAssetId,
            fileKey,
            fileName: valid.fileName,
            mimeType: valid.mimeType,
            fileSize: file!.size,
          },
        });
        return tx.design.update({
          where: { id },
          data: {
            currentAssetId: asset.id,
            sourceAssetId: design.sourceAssetId ?? asset.id,
          },
          include: includeAssets,
        });
      });
    } catch (error) {
      await this.storage.delete(fileKey, false).catch(() => undefined);
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    const design = await this.findOne(userId, id);
    const assets = await this.prisma.designAsset.findMany({
      where: { designId: id },
      select: { id: true, fileKey: true },
    });
    await this.prisma.design.delete({ where: { id: design.id } });
    const assetIds = assets.map((asset) => asset.id);
    if (!assetIds.length) return;
    const shared = await this.prisma.design.count({
      where: {
        OR: [
          { sourceAssetId: { in: assetIds } },
          { currentAssetId: { in: assetIds } },
        ],
      },
    });
    if (shared > 0) return;
    await this.prisma.designAsset.deleteMany({
      where: { id: { in: assetIds } },
    });
    await Promise.allSettled(
      assets.map((asset) => this.storage.delete(asset.fileKey, false)),
    );
  }

  async toResponse(design: DesignWithAssets) {
    const mapAsset = async (asset: DesignAssetResponseSource | null) =>
      asset
        ? {
            id: asset.id,
            fileName: asset.fileName,
            mimeType: asset.mimeType,
            fileSize: asset.fileSize,
            url: await this.storage.generateDownloadUrl(asset.fileKey, false),
            sourceAssetId: asset.sourceAssetId,
            createdAt: asset.createdAt,
          }
        : null;
    return {
      id: design.id,
      name: design.name,
      sourceAsset: await mapAsset(design.sourceAsset),
      currentAsset: await mapAsset(design.currentAsset),
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
    };
  }
}
