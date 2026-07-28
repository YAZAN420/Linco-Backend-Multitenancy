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
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }

    const asset = await this.assetQueryRepository.findById(input.assetId);
    if (!asset) {
      throw new NotFoundException('errors.ASSET_NOT_FOUND');
    }

    if (!asset.course || !asset.course.isPublished) {
      throw new BadRequestException(
        'errors.CANNOT_ASSIGN_AN_UNPUBLISHED_COURSE_TO_A_DEPARTMENT',
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
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    const departmentCourse =
      await this.departmentCourseCommandRepository.findById(departmentCourseId);
    if (!departmentCourse)
      throw new NotFoundException('errors.DEPARTMENT_COURSE_NOT_FOUND');
    return departmentCourse;
  }
}
