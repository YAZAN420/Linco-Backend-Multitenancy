import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { CreateCertificationInput } from 'src/certifications/application/interfaces/create-certification-input.interface';

export class CreateCertificationDto implements CreateCertificationInput {
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsString()
  @IsNotEmpty()
  demoMemberId!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;
}
