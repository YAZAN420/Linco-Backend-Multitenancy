import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateQuestionsBankInput } from 'src/questionBanks/application/interfaces/update-questionsBank-input.interface';

export class UpdateQuestionBankDto implements UpdateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text!: string;
}
