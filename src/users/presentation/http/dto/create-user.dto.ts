import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { CreateUserInput } from 'src/users/application/interfaces/create-user-input.interface';
import { Role } from 'src/users/domain/enums/role.enum';

export class CreateUserDto implements CreateUserInput {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Type(() => Date)
  @IsDateString()
  @IsNotEmpty()
  birthDate!: Date;

  @IsString()
  @IsNotEmpty()
  imagePath!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;
}
