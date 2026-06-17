import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterQuestionsBankDto } from './filter-questionsBank.dto';

export class FindQuestionsBankCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterQuestionsBankDto,
) {}
