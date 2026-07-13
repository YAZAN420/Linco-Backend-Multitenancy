import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentCourseCommandRepository } from './ports/departmentCourse-command.repository';
import { DepartmentCourseFactory } from '../domain/factories/departmentCourse.factory';
import { DepartmentCourse } from '../domain/departmentCourse';

import { CreateDepartmentCourseInput } from './interfaces/create-departmentCourse-input.interface';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import { AssetQueryRepository } from 'src/assets/application/ports/asset-query.repository';

@Injectable()
export class DepartmentCoursesCommandService {
  constructor(
    private readonly departmentCourseCommandRepository: DepartmentCourseCommandRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly assetQueryRepository: AssetQueryRepository,
    private readonly departmentCourseFactory: DepartmentCourseFactory,
  ) {}

  async create(
    departmentId: string,
    input: CreateDepartmentCourseInput,
  ): Promise<DepartmentCourse> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException(`Department not found`);
    }

    const asset = await this.assetQueryRepository.findById(input.assetId);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (!asset.course || !asset.course.isPublished) {
      throw new BadRequestException(
        'Cannot assign an unpublished course to a department',
      );
    }

    const departmentCourse = this.departmentCourseFactory.createNew(
      departmentId,
      input.assetId,
    );
    await this.departmentCourseCommandRepository.save(departmentCourse);
    return departmentCourse;
  }

  async remove(
    departmentId: string,
    departmentCourseId: string,
  ): Promise<void> {
    await this.findById(departmentId, departmentCourseId);
    await this.departmentCourseCommandRepository.delete(departmentCourseId);
  }

  async findById(
    departmentId: string,
    departmentCourseId: string,
  ): Promise<DepartmentCourse> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException(`Department not found`);
    }
    const departmentCourse =
      await this.departmentCourseCommandRepository.findById(departmentCourseId);
    if (!departmentCourse)
      throw new NotFoundException('departmentCourse not found');
    return departmentCourse;
  }
}
