import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NumberFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  equals?: number;
}
