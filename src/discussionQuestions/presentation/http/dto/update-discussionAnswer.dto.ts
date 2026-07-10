import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateDiscussionAnswerInput } from 'src/discussionQuestions/application/interfaces/update-discussionAnswer-input.interface';

export class UpdateDiscussionAnswerDto implements UpdateDiscussionAnswerInput {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
