import { IsNotEmpty, IsString } from 'class-validator';
import { CreateQuestionsBankInput } from 'src/questionBanks/application/interfaces/create-questionsBank-input.interface';

export class CreateQuestionBankDto implements CreateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
