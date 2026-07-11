import { IsOptional, IsString } from 'class-validator';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';

export class UsersCursorQueryDto extends CursorPageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
