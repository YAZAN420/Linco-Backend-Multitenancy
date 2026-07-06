import { Module } from '@nestjs/common';
import { TagsController } from './presentation/http/controllers/tags.controller';
import { TagsService } from './application/tags.service';
import { TagRepository } from './application/ports/tag.repository';
import { PrismaTagRepository } from './infrastructure/repositories/prisma-tag.repository';
import { TagResponseMapper } from './presentation/http/mappers/tag-response.mapper';

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    TagResponseMapper,
    {
      provide: TagRepository,
      useClass: PrismaTagRepository,
    },
  ],
  exports: [TagsService, TagResponseMapper],
})
export class TagsModule {}
