import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderByInput } from '../../order-by.dto';

export class CursorPageOptionsDto {
  @IsString()
  @IsOptional()
  readonly cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @IsOptional()
  @IsObject()
  orderBy?: OrderByInput;
}
