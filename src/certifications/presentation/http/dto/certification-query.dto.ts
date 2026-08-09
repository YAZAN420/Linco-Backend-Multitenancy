import { IsOptional, IsString } from 'class-validator';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FindCertificationsCursorQuery } from 'src/certifications/application/interfaces/find-certifications.query';

export class CertificationQueryDto
  extends CursorPageOptionsDto
  implements FindCertificationsCursorQuery
{
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  demoMemberId?: string;
}
