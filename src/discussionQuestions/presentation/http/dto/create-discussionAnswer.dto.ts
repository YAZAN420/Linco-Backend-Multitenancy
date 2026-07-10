import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDiscussionAnswerInput } from 'src/discussionQuestions/application/interfaces/create-discussionAnswer-input.interface';

export class CreateDiscussionAnswerDto implements CreateDiscussionAnswerInput {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
