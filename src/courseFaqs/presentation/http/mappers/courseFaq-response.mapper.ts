import { Injectable } from '@nestjs/common';
import { CourseFaqResponseDto } from '../dto/courseFaq-response.dto';
import { CourseFaq as PrismaCourseFaq } from 'src/generated/prisma/client';
@Injectable()
export class CourseFaqResponseMapper {
  toResponseFromPrisma(courseFaq: PrismaCourseFaq): CourseFaqResponseDto {
    return new CourseFaqResponseDto(
      courseFaq.id,
      courseFaq.question,
      courseFaq.answer,
      courseFaq.courseId,
      courseFaq.createdAt,
      courseFaq.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    courseFaqs: PrismaCourseFaq[],
  ): CourseFaqResponseDto[] {
    return courseFaqs.map((courseFaq) => this.toResponseFromPrisma(courseFaq));
  }
}
