import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { AdminUpdateUserInput } from 'src/users/application/interfaces/admin-update-user-input.interface';
import { Role } from 'src/users/domain/enums/role.enum';
export class AdminUpdateUserDto implements AdminUpdateUserInput {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsString()
  imagePath?: string | null;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
