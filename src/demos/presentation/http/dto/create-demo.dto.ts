import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDemoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  imagePath!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
