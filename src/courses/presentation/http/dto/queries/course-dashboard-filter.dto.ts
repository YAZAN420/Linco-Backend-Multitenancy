import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseVisibility } from 'src/generated/prisma/client';

export class CourseDashboardFilterDto {
  @ApiPropertyOptional({
    description: 'Search term for course title, description, or creator name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by publication status (true for published, false for drafts)',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isPublished?: boolean;

  @ApiPropertyOptional({
    enum: CourseVisibility,
    description: 'Filter by course visibility (PUBLIC or PRIVATE)',
  })
  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility?: CourseVisibility;

  @ApiPropertyOptional({
    description: 'Filter by demo/workspace ID',
  })
  @IsOptional()
  @IsString()
  demoId?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag IDs',
    type: [String],
  })
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
