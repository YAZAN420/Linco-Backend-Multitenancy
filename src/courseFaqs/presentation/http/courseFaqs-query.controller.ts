import { Controller, Get, Param, Query } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

import { CourseFaqsQueryService } from 'src/courseFaqs/application/courseFaqs-query.service';

import { CourseFaqResponseMapper } from './mappers/courseFaq-response.mapper';

@Controller('courses/:courseId/courseFaqs')
export class CourseFaqsQueryController {
  constructor(
    private readonly courseFaqQueryService: CourseFaqsQueryService,
    private readonly courseFaqResponseMapper: CourseFaqResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('courseId') courseId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const courseFaqs = await this.courseFaqQueryService.findAllCursor(
      courseId,
      options,
    );

    return {
      message: 'CourseFaqs fetched successfully',
      data: this.courseFaqResponseMapper.toResponseManyFromPrisma(
        courseFaqs.data,
      ),
      meta: courseFaqs.meta,
    };
  }

  @Get(':courseFaqId')
  async findOne(
    @Param(':courseId') courseId: string,
    @Param('courseFaqId') courseFaqId: string,
  ) {
    const courseFaq = await this.courseFaqQueryService.findById(
      courseId,
      courseFaqId,
    );

    return {
      message: 'CourseFaq retrieved successfully',
      data: this.courseFaqResponseMapper.toResponseFromPrisma(courseFaq),
    };
  }
}
