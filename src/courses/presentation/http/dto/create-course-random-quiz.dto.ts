import { IsInt, Min, Max } from 'class-validator';

export class CreateCourseRandomQuizDto {
  @IsInt()
  @Min(1)
  @Max(3)
  questionCount!: number;
}
