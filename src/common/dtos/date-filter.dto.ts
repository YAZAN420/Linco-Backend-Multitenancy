import { IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateFilter } from '../interfaces/date-filter.interface';

export class DateFilterDto implements DateFilter {
  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string | number | Date) : undefined,
  )
  gte?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string | number | Date) : undefined,
  )
  lte?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string | number | Date) : undefined,
  )
  gt?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }: { value: unknown }) =>
    value ? new Date(value as string | number | Date) : undefined,
  )
  lt?: Date;
}
