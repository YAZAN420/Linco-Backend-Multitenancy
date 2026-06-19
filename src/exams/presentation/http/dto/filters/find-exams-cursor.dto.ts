import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterExamsDto } from './filter-exams.dto';

export class FindExamsCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterExamsDto,
) {}
