import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DateFilterDto } from 'src/common/dtos/date-filter.dto';
import { Role } from 'src/users/domain/enums/role.enum';

export class FilterUsersDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  })
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  createdAt?: DateFilterDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateFilterDto)
  birthDate?: DateFilterDto;
}
