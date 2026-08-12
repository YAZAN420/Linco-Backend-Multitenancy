import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { IsDate, IsOptional } from 'class-validator';

export class ReportDateRangeQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  to?: Date;

  toRange() {
    const to = this.to ?? new Date();
    const from = this.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (from > to) {
      throw new BadRequestException(
        'errors.REPORT_FROM_DATE_MUST_BE_BEFORE_TO_DATE',
      );
    }
    return { from, to };
  }
}
