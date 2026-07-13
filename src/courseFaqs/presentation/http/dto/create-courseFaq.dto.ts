import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCourseFaqInput } from 'src/courseFaqs/application/interfaces/create-courseFaq-input.interface';

export class CreateCourseFaqDto implements CreateCourseFaqInput {
  @IsNotEmpty()
  @IsString()
  question!: string;
  @IsNotEmpty()
  @IsString()
  answer!: string;
}
