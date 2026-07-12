import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { TagsService } from '../../../application/tags.service';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { HttpCacheInterceptor } from 'src/common/interceptors/http-cache.interceptor';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { CachePublic } from 'src/common/decorators/cache-public.decorator';
import { ClearCache } from 'src/common/decorators/clear-cache.decorator';

@UseInterceptors(HttpCacheInterceptor, ClearCacheInterceptor)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @CachePublic()
  async getAll() {
    return this.tagsService.getAll();
  }

  @Get(':id')
  @CachePublic()
  async getById(@Param('id') id: string) {
    return this.tagsService.getById(id);
  }

  @Post()
  @ClearCache(['GET:/tags:ROLE:*'])
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto.name);
  }

  @Patch(':id')
  @ClearCache(['GET:/tags:ROLE:*', 'GET:/tags/:id:ROLE:*'])
  async update(@Param('id') id: string, @Body() dto: CreateTagDto) {
    return this.tagsService.update(id, dto.name);
  }

  @Delete(':id')
  @ClearCache(['GET:/tags:ROLE:*', 'GET:/tags/:id:ROLE:*'])
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
