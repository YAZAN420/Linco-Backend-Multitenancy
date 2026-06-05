import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindDemosCursorQuery,
  FindDemosQuery,
} from './interfaces/find-demos.query';
import { Demo } from 'src/generated/prisma/client';
import { DemoQueryRepository } from './ports/demo-query.repository';

@Injectable()
export class DemosQueryService {
  constructor(private readonly demoQueryRepository: DemoQueryRepository) {}

  async findAll(pageOptionsDto: FindDemosQuery): Promise<PageDto<Demo>> {
    return this.demoQueryRepository.findAll(pageOptionsDto);
  }

  async findAllForMe(
    options: FindDemosCursorQuery,
    id: string,
  ): Promise<CursorPageDto<Demo>> {
    return this.demoQueryRepository.findAllForMe(options, id);
  }

  async findById(id: string): Promise<Demo> {
    const demo = await this.demoQueryRepository.findById(id);
    if (!demo) throw new NotFoundException('Demo not found');
    return demo;
  }
}
