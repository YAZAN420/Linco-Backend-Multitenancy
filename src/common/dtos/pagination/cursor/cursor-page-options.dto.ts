import { Transform, Type } from 'class-transformer';
import {
  IsArray,
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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): string[] | undefined => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return undefined;
  })
  readonly with?: string[];
}
