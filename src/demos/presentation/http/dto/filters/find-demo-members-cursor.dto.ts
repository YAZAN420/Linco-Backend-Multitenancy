import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDemoMembersDto } from './filter-demo-members.dto';

export class FindDemoMembersCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterDemoMembersDto,
) {}
