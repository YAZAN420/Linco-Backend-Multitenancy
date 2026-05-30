import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Max, Min } from 'class-validator';
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
  @IsObject()
  orderBy?: OrderByInput;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
