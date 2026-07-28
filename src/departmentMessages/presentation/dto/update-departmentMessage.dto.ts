import { IsString, IsNotEmpty } from 'class-validator';
import { UpdateDepartmentMessageInput } from 'src/departmentMessages/application/interfaces/update-departmentMessage-input.interface';

export class UpdateDepartmentMessageDto implements UpdateDepartmentMessageInput {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
