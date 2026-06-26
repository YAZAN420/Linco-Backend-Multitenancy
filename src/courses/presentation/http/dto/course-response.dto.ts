import { DemoResponseDto } from 'src/demos/presentation/http/dto/demo/demo-response.dto';

export class CourseResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly visibility: string,
    readonly price: number | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly demo?: DemoResponseDto,
  ) {}
}
