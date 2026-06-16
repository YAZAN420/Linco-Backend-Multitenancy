import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateQuestionsBankInput } from 'src/questionsBank/application/interfaces/create-questionsBank-input.interface';

export class CreateQuestionsBankDto implements CreateQuestionsBankInput {
  @IsNumber()
  @IsNotEmpty()
  numberOfQuestions!: number;

  @IsString()
  @IsNotEmpty()
  text!: string;
}
