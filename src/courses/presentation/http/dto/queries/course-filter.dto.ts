import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CourseFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => id.trim());
    }

    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    }

    return [];
  })
  tagIds?: string[];
}
