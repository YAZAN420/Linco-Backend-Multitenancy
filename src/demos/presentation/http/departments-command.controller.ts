import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartmentsCommandService } from 'src/demos/application/departments-command.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('demos/:demoId/departments')
export class DepartmentsCommandController {
  constructor(
    private readonly departmentsCommandService: DepartmentsCommandService,
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
}
