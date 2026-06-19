import { Injectable } from '@nestjs/common';
import { DepartmentCourseResponseDto } from '../dto/departmentCourse-response.dto';
import { DepartmentCourse as DomainDepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';
import { AssetResponseMapper } from 'src/assets/presentation/http/mappers/asset-response.mapper';

@Injectable()
export class DepartmentCourseResponseMapper {
  constructor(private readonly assetResponseMapper: AssetResponseMapper) {}
  toResponseFromPrisma(
    departmentCourse: DepartmentCourseWithAssetWithCourse,
  ): DepartmentCourseResponseDto {
    return new DepartmentCourseResponseDto(
      departmentCourse.id,
      departmentCourse.departmentId,
      departmentCourse.assignedAt,
      departmentCourse.updatedAt,
      departmentCourse.asset
        ? this.assetResponseMapper.toResponseFromPrisma(departmentCourse.asset)
        : undefined,
    );
  }

  toResponseFromDomain(
    departmentCourse: DomainDepartmentCourse,
  ): DepartmentCourseResponseDto {
    return new DepartmentCourseResponseDto(
      departmentCourse.id,
      departmentCourse.departmentId,
      departmentCourse.assignedAt,
      departmentCourse.updatedAt,
      undefined,
    );
  }

  toResponseManyFromPrisma(
    departmentCourses: DepartmentCourseWithAssetWithCourse[],
  ): DepartmentCourseResponseDto[] {
    return departmentCourses.map((departmentCourse) =>
      this.toResponseFromPrisma(departmentCourse),
    );
  }
}
