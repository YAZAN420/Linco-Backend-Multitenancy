import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { UpdateUserInput } from 'src/users/application/interfaces/update-user-input.interface';

export class UpdateUserDto implements UpdateUserInput {
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
}
