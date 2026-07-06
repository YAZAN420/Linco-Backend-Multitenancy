import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TagsService } from '../../../application/tags.service';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAll() {
    return this.tagsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.tagsService.getById(id);
  }

  @Post('admin')
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto.name);
  }

  @Patch('admin/:id')
  async update(@Param('id') id: string, @Body() dto: CreateTagDto) {
    return this.tagsService.update(id, dto.name);
  }

  @Delete('admin/:id')
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
