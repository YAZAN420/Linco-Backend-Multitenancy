import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DesignsService } from '../../application/designs.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { DesignQueryDto } from './dto/design-query.dto';
import {
  DESIGN_MAX_FILE_SIZE,
  DesignUploadFile,
} from '../../application/design-file.validator';

@Controller('designs')
export class DesignsController {
  constructor(private readonly designs: DesignsService) {}

  @Post()
  async create(@ActiveUser('id') userId: string, @Body() dto: CreateDesignDto) {
    return {
      message: 'messages.DESIGN_CREATED_SUCCESSFULLY',
      data: await this.designs.toResponse(
        await this.designs.create(userId, dto),
      ),
    };
  }

  @Get()
  async findAll(
    @ActiveUser('id') userId: string,
    @Query() query: DesignQueryDto,
  ) {
    const result = await this.designs.findAll(userId, query.page, query.limit);
    return {
      message: 'messages.DESIGNS_FETCHED_SUCCESSFULLY',
      data: await Promise.all(
        result.data.map((item) => this.designs.toResponse(item)),
      ),
      meta: result.meta,
    };
  }

  @Get(':id')
  async findOne(@ActiveUser('id') userId: string, @Param('id') id: string) {
    return {
      message: 'messages.DESIGN_RETRIEVED_SUCCESSFULLY',
      data: await this.designs.toResponse(
        await this.designs.findOne(userId, id),
      ),
    };
  }

  @Patch(':id')
  async update(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDesignDto,
  ) {
    return {
      message: 'messages.DESIGN_UPDATED_SUCCESSFULLY',
      data: await this.designs.toResponse(
        await this.designs.update(userId, id, dto),
      ),
    };
  }

  @Post(':id/export')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: DESIGN_MAX_FILE_SIZE } }),
  )
  async export(
    @ActiveUser('id') userId: string,
    @Param('id') id: string,
    @UploadedFile() file?: DesignUploadFile,
  ) {
    return {
      message: 'messages.DESIGN_EXPORTED_SUCCESSFULLY',
      data: await this.designs.toResponse(
        await this.designs.export(userId, id, file),
      ),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@ActiveUser('id') userId: string, @Param('id') id: string) {
    await this.designs.remove(userId, id);
    return null;
  }
}
