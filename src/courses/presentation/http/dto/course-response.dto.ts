import { DemoResponseDto } from 'src/demos/presentation/http/dto/demo/demo-response.dto';
import { TagResponseDto } from 'src/tags/presentation/http/dtos/tag-response.dto';

export class CourseResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly visibility: string,
    readonly price: number | null,
    readonly description: string,
    readonly imagePath: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly tags: TagResponseDto[],
    readonly demo?: DemoResponseDto,
  ) {}
}
