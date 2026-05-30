import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterUsersDto } from './filter-users.dto';
import { FindUsersCursorQuery } from 'src/users/application/interfaces/find-users.query';

export class FindUsersCursorDto
  extends IntersectionType(CursorPageOptionsDto, FilterUsersDto)
  implements FindUsersCursorQuery {}
