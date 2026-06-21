import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator";
import { CreateExamAttemptInput } from "src/exams/application/interfaces/create-exam-attempt-input.interface";

export class CreateExamAttemptDto implements CreateExamAttemptInput {
    @IsPositive()
    @IsInt()
    @Min(0)
    @Max(100)
    score!: number;


    @IsString() 
    @IsNotEmpty() 
    examId!: string;

    
}
