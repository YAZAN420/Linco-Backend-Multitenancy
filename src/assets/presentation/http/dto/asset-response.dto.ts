import { CourseResponseDto } from 'src/courses/presentation/http/dto/course-response.dto';

export class AssetResponseDto {
  constructor(
    readonly id: string,
    readonly demoId: string,
    readonly accessMethod: string,
    readonly acquiredAt: Date,
    readonly updatedAt: Date,
    readonly course?: CourseResponseDto,
  ) {}
}
