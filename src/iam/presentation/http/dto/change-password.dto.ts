import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
