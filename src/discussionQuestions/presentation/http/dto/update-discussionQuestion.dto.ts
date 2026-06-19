import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateDiscussionQuestionInput } from 'src/discussionQuestions/application/interfaces/update-discussionQuestion-input.interface';

export class UpdateDiscussionQuestionDto implements UpdateDiscussionQuestionInput {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
