import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './mappers/update-demo.dto';

import { DemoResponseMapper } from './mappers/demo-response.mapper';
import { DemosCommandService } from 'src/demos/application/demos-command.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

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

  @Post(':id/departments')
  async addDepartment(
    @Param('id') id: string,
    @Body() dto: CreateDepartmentDto,
  ) {
    await this.demoCommandService.addDepartment(id, dto);

    return {
      message: 'Department added successfully',
      data: null,
    };
  }

  @Patch(':id/departments/:departmentId')
  async updateDepartment(
    @Param('id') id: string,
    @Param('departmentId') departmentId: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    await this.demoCommandService.updateDepartment(id, departmentId, dto);

    return {
      message: 'Department updated successfully',
      data: null,
    };
  }

  @Delete(':id/departments/:departmentId')
  async removeDepartment(
    @Param('id') id: string,
    @Param('departmentId') departmentId: string,
  ) {
    await this.demoCommandService.removeDepartment(id, departmentId);

    return {
      message: 'Department removed successfully',
      data: null,
    };
  }
}
