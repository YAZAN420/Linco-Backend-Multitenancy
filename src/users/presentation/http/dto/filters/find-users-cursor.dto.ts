import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUserDto } from './filter-user.dto';

export class FindUsersCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterUserDto,
) {}
