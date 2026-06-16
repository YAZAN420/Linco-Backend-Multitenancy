import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterQuestionsBankDto } from './filter-questionsBank.dto';

export class FindQuestionsBankDto extends IntersectionType(
  PageOptionsDto,
  FilterQuestionsBankDto,
) {}
