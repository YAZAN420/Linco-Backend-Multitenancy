import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUsersDto } from './filter-users.dto';

export class FindUsersDto extends IntersectionType(
  PageOptionsDto,
  FilterUsersDto,
) {}
