import { IsNotEmpty, IsString } from 'class-validator';
import { CreateQuestionsBankInput } from 'src/questionsBanks/application/interfaces/create-questionsBank-input.interface';

export class CreateQuestionsBankDto implements CreateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
