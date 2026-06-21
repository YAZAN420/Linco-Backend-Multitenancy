import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionsBankInput } from 'src/questionBanks/application/interfaces/create-questionsBank-input.interface';
import { ChoiceDto } from './choice.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionBankDto implements CreateQuestionsBankInput {
  @ApiProperty({ description: 'Text of the question' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ description: 'List of choices for the question' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices!: ChoiceDto[];
}
