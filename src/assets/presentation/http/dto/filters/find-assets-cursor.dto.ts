import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterAssetsDto } from './filter-assets.dto';

export class FindAssetsCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterAssetsDto,
) {}
