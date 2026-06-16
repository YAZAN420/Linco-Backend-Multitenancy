import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterSectionsDto } from './filter-sections.dto';

export class FindSectionsDto extends IntersectionType(
  PageOptionsDto,
  FilterSectionsDto,
) {}
