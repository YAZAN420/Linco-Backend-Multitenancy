import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDemosDto } from './filter-demos.dto';

export class FindDemoMembersCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterDemosDto,
) {}
