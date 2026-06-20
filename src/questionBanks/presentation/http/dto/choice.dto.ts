import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ChoiceDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;
}