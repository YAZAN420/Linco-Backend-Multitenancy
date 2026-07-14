import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateCourseFaqDto } from './dto/create-courseFaq.dto';

import { CourseFaqResponseMapper } from './mappers/courseFaq-response.mapper';
import { CourseFaqsCommandService } from 'src/courseFaqs/application/courseFaqs-command.service';
import { CourseFaqsQueryService } from 'src/courseFaqs/application/courseFaqs-query.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CourseFaq')
@Controller('courses/:courseId/courseFaqs')
export class CourseFaqsCommandController {
  constructor(
    private readonly courseFaqCommandService: CourseFaqsCommandService,
    private readonly courseFaqQueryService: CourseFaqsQueryService,
    private readonly courseFaqResponseMapper: CourseFaqResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseFaqDto,
  ) {
    const createdCourseFaq = await this.courseFaqCommandService.create(
      courseId,
      dto,
    );

    const courseFaq = await this.courseFaqQueryService.findById(
      courseId,
      createdCourseFaq.id,
    );

    return {
      message: 'CourseFaq created successfully',
      data: this.courseFaqResponseMapper.toResponseFromPrisma(courseFaq),
    };
  }

  @Delete(':courseFaqId')
  async remove(
    @Param('courseId') courseId: string,
    @Param('courseFaqId') courseFaqId: string,
  ) {
    await this.courseFaqCommandService.remove(courseId, courseFaqId);

    return {
      message: 'CourseFaq deleted successfully',
      data: null,
    };
  }
}
