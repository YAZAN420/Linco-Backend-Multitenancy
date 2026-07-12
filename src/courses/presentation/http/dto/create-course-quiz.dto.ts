import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateCourseQuizDto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  questionCount!: number;
}
