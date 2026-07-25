import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { CreateExamAttemptInput } from 'src/exams/application/interfaces/create-exam-attempt-input.interface';

export class CreateExamAttemptDto implements CreateExamAttemptInput {
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsString()
  @IsNotEmpty()
  examId!: string;
}
