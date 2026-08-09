import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificationsQueryService } from 'src/certifications/application/certifications-query.service';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';
import { CertificationQueryDto } from './dto/certification-query.dto';
import { CertificationResponseMapper } from './mappers/certification-response.mapper';

@ApiTags('Certification')
@Public()
@Controller('certifications')
export class CertificationsQueryController {
  constructor(
    private readonly service: CertificationsQueryService,
    private readonly mapper: CertificationResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(@Query() options: CertificationQueryDto) {
    const certifications = await this.service.findAllCursor(options);
    return {
      message: 'messages.CERTIFICATIONS_FETCHED_SUCCESSFULLY',
      data: this.mapper.toResponseManyFromPrisma(certifications.data),
      meta: certifications.meta,
    };
  }

  @Get(':certificationId')
  async findOne(@Param('certificationId') certificationId: string) {
    const certification = await this.service.findById(certificationId);
    return {
      message: 'messages.CERTIFICATION_RETRIEVED_SUCCESSFULLY',
      data: this.mapper.toResponseFromPrisma(certification),
    };
  }
}
