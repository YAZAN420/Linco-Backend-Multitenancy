import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterExamsDto } from './filter-exams.dto';

export class FindExamsDto extends IntersectionType(
  PageOptionsDto,
  FilterExamsDto,
) {}
