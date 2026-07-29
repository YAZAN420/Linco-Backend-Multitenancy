import { IsNotEmpty, IsString } from 'class-validator';

export class JoinDepartmentDto {
  @IsString()
  @IsNotEmpty()
  departmentId!: string;
}
