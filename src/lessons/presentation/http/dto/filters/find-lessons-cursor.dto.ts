import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterLessonsDto } from './filter-lessons.dto';

export class FindLessonsCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterLessonsDto,
) {}
