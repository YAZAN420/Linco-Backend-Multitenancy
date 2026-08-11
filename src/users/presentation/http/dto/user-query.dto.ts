import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export class UsersQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
