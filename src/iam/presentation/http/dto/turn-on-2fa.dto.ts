import { IsString, IsNotEmpty, Length } from 'class-validator';

export class TurnOn2FADto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  tfaCode!: string;
}
