import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterQuestionsBankDto } from './filter-questionsBank.dto';

export class FindQuestionBanksCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterQuestionsBankDto,
) {}
