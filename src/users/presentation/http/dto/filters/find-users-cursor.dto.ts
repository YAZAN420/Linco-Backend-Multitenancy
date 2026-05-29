import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUsersDto } from './filter-users.dto';

export class FindUsersCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterUsersDto,
) {}
