import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDemosDto } from './filter-demos.dto';

export class FindDemosCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterDemosDto,
) {}
