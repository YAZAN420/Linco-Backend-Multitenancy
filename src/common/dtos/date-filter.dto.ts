import { IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class DateFilterDto {
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
