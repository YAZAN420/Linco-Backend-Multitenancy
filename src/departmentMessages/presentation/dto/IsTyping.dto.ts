import { IsBoolean, IsNotEmpty } from 'class-validator';

export class IsTypingDto {
  @IsBoolean()
  @IsNotEmpty()
  isTyping!: boolean;
}
