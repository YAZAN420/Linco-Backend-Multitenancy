import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUsersDto } from './filter-users.dto';
import { FindUsersQuery } from 'src/users/application/interfaces/find-users.query';

export class FindUsersDto
  extends IntersectionType(PageOptionsDto, FilterUsersDto)
  implements FindUsersQuery {}
