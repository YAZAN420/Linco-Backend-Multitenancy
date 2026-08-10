import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { CertificationsQueryService } from 'src/certifications/application/certifications-query.service';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { CertificationQueryDto } from './dto/certification-query.dto';
import { CertificationResponseMapper } from './mappers/certification-response.mapper';

@ApiTags('Certification')
@Controller('certifications')
export class CertificationsQueryController {
  constructor(
    private readonly service: CertificationsQueryService,
    private readonly mapper: CertificationResponseMapper,
  ) {}

  @Get('me')
  @UseGuards(DemoRolesGuard)
  async findMine(
    @ActiveDemoMember('id') demoMemberId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const certifications = await this.service.findMineCursor(
      demoMemberId,
      options,
    );
    console.log('certifications', certifications);
    return {
      message: 'messages.CERTIFICATIONS_FETCHED_SUCCESSFULLY',
      data: this.mapper.toResponseManyFromPrisma(certifications.data),
      meta: certifications.meta,
    };
  }

  @Get('me/courses/:courseId')
  @UseGuards(DemoRolesGuard)
  async findMineForCourse(
    @ActiveDemoMember('id') demoMemberId: string,
    @Param('courseId') courseId: string,
  ) {
    const certification = await this.service.findMineByCourse(
      demoMemberId,
      courseId,
    );
    return {
      message: 'messages.CERTIFICATION_RETRIEVED_SUCCESSFULLY',
      data: this.mapper.toResponseFromPrisma(certification),
    };
  }

  @Get('cursor')
  @Public()
  async findWithCursor(@Query() options: CertificationQueryDto) {
    const certifications = await this.service.findAllCursor(options);
    return {
      message: 'messages.CERTIFICATIONS_FETCHED_SUCCESSFULLY',
      data: this.mapper.toResponseManyFromPrisma(certifications.data),
      meta: certifications.meta,
    };
  }

  @Get(':certificationId')
  @Public()
  async findOne(@Param('certificationId') certificationId: string) {
    const certification = await this.service.findById(certificationId);
    return {
      message: 'messages.CERTIFICATION_RETRIEVED_SUCCESSFULLY',
      data: this.mapper.toResponseFromPrisma(certification),
    };
  }
}
