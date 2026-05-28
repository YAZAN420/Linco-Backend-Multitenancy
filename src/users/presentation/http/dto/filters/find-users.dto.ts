import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUserDto } from './filter-user.dto';

export class FindUsersDto extends IntersectionType(
  PageOptionsDto,
  FilterUserDto,
) {}
