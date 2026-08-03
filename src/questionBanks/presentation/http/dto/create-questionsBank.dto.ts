import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionsBankInput } from 'src/questionBanks/application/interfaces/create-questionsBank-input.interface';
import { ChoiceDto } from './choice.dto';

export class CreateQuestionBankDto implements CreateQuestionsBankInput {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices!: ChoiceDto[];

  @IsString()
  note!: string;
}
