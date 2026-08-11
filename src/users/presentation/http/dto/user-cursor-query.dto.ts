import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export class UsersCursorQueryDto extends CursorPageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
