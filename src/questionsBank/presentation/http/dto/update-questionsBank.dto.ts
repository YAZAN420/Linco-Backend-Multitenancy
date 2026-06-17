import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateQuestionsBankInput } from 'src/questionsBank/application/interfaces/update-questionsBank-input.interface';

export class UpdateQuestionsBankDto implements UpdateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text!: string;
}
