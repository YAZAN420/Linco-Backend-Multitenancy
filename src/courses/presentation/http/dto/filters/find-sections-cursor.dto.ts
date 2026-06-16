import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterSectionsDto } from './filter-sections.dto';

export class FindSectionsCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterSectionsDto,
) {}
