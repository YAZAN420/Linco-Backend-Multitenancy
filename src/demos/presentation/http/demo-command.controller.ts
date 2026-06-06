import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

import { DemoResponseMapper } from './mappers/demo-response.mapper';
import { DemosCommandService } from 'src/demos/application/demos-command.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Controller('demos')
export class DemosCommandController {
  constructor(
    private readonly demoCommandService: DemosCommandService,
    private readonly demoResponseMapper: DemoResponseMapper,
  ) {}

  @Post()
  async create(@ActiveUser() user: ActiveUserData, @Body() dto: CreateDemoDto) {
    const demo = await this.demoCommandService.create({
      ...dto,
      ownerId: user.id,
    });

    return {
      message: 'Demo created successfully',
      data: this.demoResponseMapper.toResponseFromDomain(demo),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDemoDto) {
    const demo = await this.demoCommandService.update(id, { name: dto.name });

    return {
      message: 'Demo updated successfully',
      data: this.demoResponseMapper.toResponseFromDomain(demo),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.demoCommandService.remove(id);

    return {
      message: 'Demo deleted successfully',
      data: null,
    };
  }
}
