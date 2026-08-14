import { IsEnum, IsOptional } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class OrderByInput {
  @IsOptional()
  @IsEnum(SortDirection, { message: 'errors.ORDER_MUST_BE_ASC_OR_DESC' })
  createdAt?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'errors.ORDER_MUST_BE_ASC_OR_DESC' })
  firstName?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'errors.ORDER_MUST_BE_ASC_OR_DESC' })
  lastName?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'errors.ORDER_MUST_BE_ASC_OR_DESC' })
  email?: SortDirection;
}
