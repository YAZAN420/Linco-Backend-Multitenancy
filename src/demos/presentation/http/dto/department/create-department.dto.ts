import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  managerId!: string;
  @IsString()
  @IsNotEmpty()
  description!: string;
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean;
}
