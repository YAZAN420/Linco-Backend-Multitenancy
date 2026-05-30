import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderByInput } from '../../order-by.dto';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderByInput)
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
