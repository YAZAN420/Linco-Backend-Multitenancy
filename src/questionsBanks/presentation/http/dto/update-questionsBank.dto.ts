import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateQuestionsBankInput } from 'src/questionsBanks/application/interfaces/update-questionsBank-input.interface';

export class UpdateQuestionsBankDto implements UpdateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text!: string;
}
