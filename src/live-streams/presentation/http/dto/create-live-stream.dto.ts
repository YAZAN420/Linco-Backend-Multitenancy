import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateLiveStreamInput } from 'src/live-streams/application/interfaces/create-live-stream.interface';

export class CreateLiveStreamDto implements CreateLiveStreamInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;
}
