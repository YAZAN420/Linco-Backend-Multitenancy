import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterQuestionsBankDto } from './filter-questionsBank.dto';

export class FindQuestionsBanksDto extends IntersectionType(
  PageOptionsDto,
  FilterQuestionsBankDto,
) {}
