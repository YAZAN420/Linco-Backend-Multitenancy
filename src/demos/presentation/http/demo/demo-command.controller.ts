import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateDemoDto } from '../dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../dto/demo/update-demo.dto';

import { DemoResponseMapper } from '../mappers/demo-response.mapper';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { DemosCommandService } from 'src/demos/application/demo/demos-command.service';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';

@ApiTags('Demo')
@Controller('demos')
export class DemosCommandController {
  constructor(
    private readonly demoCommandService: DemosCommandService,
    private readonly demoResponseMapper: DemoResponseMapper,
  ) {}

  @Post('upload-url')
  async getUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.demoCommandService.generateDemoImageUploadUrl(
      dto.fileName,
    );
  }

  @Post()
  async create(@ActiveUser() user: ActiveUserData, @Body() dto: CreateDemoDto) {
    const demo = await this.demoCommandService.create({
      ...dto,
      ownerId: user.id,
    });

    return {
      message: 'messages.DEMO_CREATED_SUCCESSFULLY',
      data: this.demoResponseMapper.toResponseFromDomain(demo),
    };
  }

  @Patch(':id')
  @UseGuards(DemoRolesGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateDemoDto) {
    const demo = await this.demoCommandService.update(id, { name: dto.name });

    return {
      message: 'messages.DEMO_UPDATED_SUCCESSFULLY',
      data: this.demoResponseMapper.toResponseFromDomain(demo),
    };
  }

  @Delete(':id')
  @UseGuards(DemoRolesGuard)
  async remove(@Param('id') id: string) {
    await this.demoCommandService.remove(id);

    return {
      message: 'messages.DEMO_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
