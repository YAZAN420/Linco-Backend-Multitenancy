import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterAssetsDto } from './filter-assets.dto';

export class FindAssetsDto extends IntersectionType(
  PageOptionsDto,
  FilterAssetsDto,
) {}
