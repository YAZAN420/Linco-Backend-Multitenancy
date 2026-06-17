import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentCourseCommandRepository } from './ports/departmentCourse-command.repository';
import { DepartmentCourseFactory } from '../domain/factories/departmentCourse.factory';
import { DepartmentCourse } from '../domain/departmentCourse';

import { CreateDepartmentCourseInput } from './interfaces/create-departmentCourse-input.interface';
import { UpdateDepartmentCourseInput } from './interfaces/update-departmentCourse-input.interface';

@Injectable()
export class DepartmentCoursesCommandService {
  constructor(
    private readonly departmentCourseCommandRepository: DepartmentCourseCommandRepository,
    private readonly departmentCourseFactory: DepartmentCourseFactory,
  ) {}

  async create(input: CreateDepartmentCourseInput): Promise<DepartmentCourse> {
    const departmentCourse = this.departmentCourseFactory.createNew();
    await this.departmentCourseCommandRepository.save(departmentCourse);
    return departmentCourse;
  }

  async update(departmentCourseId: string, input: UpdateDepartmentCourseInput): Promise<DepartmentCourse> {
    console.log(input);
    const departmentCourse = await this.findById(departmentCourseId);
    await this.departmentCourseCommandRepository.save(departmentCourse);
    return departmentCourse;
  }

  async remove(departmentCourseId: string): Promise<void> {
    await this.findById(departmentCourseId);
    await this.departmentCourseCommandRepository.delete(departmentCourseId);
  }

  async findById(departmentCourseId: string): Promise<DepartmentCourse> {
    const departmentCourse = await this.departmentCourseCommandRepository.findById(departmentCourseId);
    if (!departmentCourse) throw new NotFoundException('departmentCourse not found');
    return departmentCourse;
  }
}
