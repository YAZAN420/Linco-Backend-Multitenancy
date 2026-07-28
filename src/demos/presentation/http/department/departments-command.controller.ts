import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CreateDepartmentDto } from '../dto/department/create-department.dto';
import { UpdateDepartmentDto } from '../dto/department/update-department.dto';
import { DepartmentsCommandService } from 'src/demos/application/department/departments-command.service';
import { GeminiService } from 'src/core/gemini/gemini.service';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DepartmentsQueryService } from 'src/demos/application/department/departments-query.service';

@ApiTags('Department')
@UseGuards(DemoRolesGuard)
@Controller('departments')
export class DepartmentsCommandController {
  constructor(
    private readonly departmentsCommandService: DepartmentsCommandService,
    private readonly departmentsQueryService: DepartmentsQueryService,
    private readonly aiRoadmapService: GeminiService,
  ) {}

  @Post()
  async addDepartment(
    @ActiveDemoMember('demoId') demoId: string,
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
    @ActiveDemoMember('demoId') demoId: string,
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
    @ActiveDemoMember('demoId') demoId: string,
    @Param('departmentId') departmentId: string,
  ) {
    await this.departmentsCommandService.removeDepartment(demoId, departmentId);
    return {
      message: 'Department removed successfully',
      data: null,
    };
  }

  @Post('generate-roadmap')
  @UseGuards(DepartmentRolesGuard)
  async createRoadmap(@Body('title') title: string) {
    const roadmap = await this.aiRoadmapService.generateRoadmap(title);
    return {
      message: 'Roadmap generated successfully',
      data: roadmap,
    };
  }
}
