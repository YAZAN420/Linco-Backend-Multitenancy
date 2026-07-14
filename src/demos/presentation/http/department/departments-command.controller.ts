import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateDepartmentDto } from '../dto/department/create-department.dto';
import { UpdateDepartmentDto } from '../dto/department/update-department.dto';
import { DepartmentsCommandService } from 'src/demos/application/department/departments-command.service';
import { GeminiService } from 'src/core/gemini/gemini.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Department')
@Controller('demos/:demoId/departments')
export class DepartmentsCommandController {
  constructor(
    private readonly departmentsCommandService: DepartmentsCommandService,
    private readonly aiRoadmapService: GeminiService,
  ) {}

  @Post()
  async addDepartment(
    @Param('demoId') demoId: string,
    @Body() dto: CreateDepartmentDto,
  ) {
    await this.departmentsCommandService.addDepartment(demoId, dto);
    return {
      message: 'Department added successfully',
      data: null,
    };
  }

  @Patch(':departmentId')
  async updateDepartment(
    @Param('demoId') demoId: string,
    @Param('departmentId') departmentId: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    await this.departmentsCommandService.updateDepartment(
      demoId,
      departmentId,
      dto,
    );
    return {
      message: 'Department updated successfully',
      data: null,
    };
  }

  @Delete(':departmentId')
  async removeDepartment(
    @Param('demoId') demoId: string,
    @Param('departmentId') departmentId: string,
  ) {
    await this.departmentsCommandService.removeDepartment(demoId, departmentId);
    return {
      message: 'Department removed successfully',
      data: null,
    };
  }

  @Post('generate-roadmap')
  async createRoadmap(@Body('title') title: string) {
    const roadmap = await this.aiRoadmapService.generateRoadmap(title);
    return {
      message: 'Roadmap generated successfully',
      data: roadmap,
    };
  }
}
