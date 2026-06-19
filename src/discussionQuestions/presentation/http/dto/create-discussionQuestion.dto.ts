import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDiscussionQuestionInput } from 'src/discussionQuestions/application/interfaces/create-discussionQuestion-input.interface';

export class CreateDiscussionQuestionDto implements CreateDiscussionQuestionInput {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
