import { Injectable } from '@nestjs/common';
import { CourseResponseDto } from '../dto/course-response.dto';
import { CourseWithDemo } from 'src/core/database/prisma/types';
import { DemoResponseMapper } from 'src/demos/presentation/http/mappers/demo-response.mapper';
import { TagResponseMapper } from 'src/tags/presentation/http/mappers/tag-response.mapper';

@Injectable()
export class CourseResponseMapper {
  constructor(
    private readonly demoResponseMapper: DemoResponseMapper,
    private readonly tagResponseMapper: TagResponseMapper,
  ) {}
  toResponseFromPrisma(course: CourseWithDemo): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.description,
      course.imagePath,
      course.createdAt,
      course.updatedAt,
      this.tagResponseMapper.toResponseManyFromPrisma(course.tags),
      this.demoResponseMapper.toSimpleResponseFromPrisma(course.demo),
    );
  }

  toResponseManyFromPrisma(courses: CourseWithDemo[]): CourseResponseDto[] {
    return courses.map((course) => this.toResponseFromPrisma(course));
  }
}
