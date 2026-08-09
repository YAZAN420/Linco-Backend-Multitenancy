import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificationsCommandService } from 'src/certifications/application/certifications-command.service';
import { CertificationsQueryService } from 'src/certifications/application/certifications-query.service';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { CertificationResponseMapper } from './mappers/certification-response.mapper';

@ApiTags('Certification')
@Roles([Role.ADMIN])
@Controller('certifications')
export class CertificationsCommandController {
  constructor(
    private readonly commandService: CertificationsCommandService,
    private readonly queryService: CertificationsQueryService,
    private readonly mapper: CertificationResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateCertificationDto) {
    const created = await this.commandService.create(dto);
    const certification = await this.queryService.findById(created.id);
    return {
      message: 'messages.CERTIFICATION_CREATED_SUCCESSFULLY',
      data: this.mapper.toResponseFromPrisma(certification),
    };
  }

  @Delete(':certificationId')
  async remove(@Param('certificationId') certificationId: string) {
    await this.commandService.remove(certificationId);
    return {
      message: 'messages.CERTIFICATION_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
