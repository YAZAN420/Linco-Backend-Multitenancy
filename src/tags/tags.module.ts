import { Module } from '@nestjs/common';
import { TagsController } from './presentation/http/controllers/tags.controller';
import { TagsService } from './application/tags.service';
import { TagRepository } from './application/ports/tag.repository';
import { PrismaTagRepository } from './infrastructure/repositories/prisma-tag.repository';

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    {
      provide: TagRepository,
      useClass: PrismaTagRepository,
    },
  ],
  exports: [TagsService],
})
export class TagsModule {}
