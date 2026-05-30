import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class WithRealtionsDto {
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
