import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDemosDto } from './filter-demos.dto';

export class FindDemosDto extends IntersectionType(
  PageOptionsDto,
  FilterDemosDto,
) {}
