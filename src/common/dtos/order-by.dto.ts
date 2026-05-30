import { IsEnum, IsOptional } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class OrderByInput {
  @IsOptional()
  @IsEnum(SortDirection, { message: 'order must be asc or desc' })
  createdAt?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'order must be asc or desc' })
  firstName?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'order must be asc or desc' })
  lastName?: SortDirection;

  @IsOptional()
  @IsEnum(SortDirection, { message: 'order must be asc or desc' })
  email?: SortDirection;
}
