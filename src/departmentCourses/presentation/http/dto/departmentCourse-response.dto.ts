import { AssetResponseDto } from 'src/assets/presentation/http/dto/asset-response.dto';

export class DepartmentCourseResponseDto {
  constructor(
    readonly id: string,
    readonly departmentId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly asset?: AssetResponseDto,
  ) {}
}
