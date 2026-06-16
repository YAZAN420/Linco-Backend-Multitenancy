import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateAssetInput } from 'src/assets/application/interfaces/create-asset-input.interface';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

export class CreateAssetDto implements CreateAssetInput {
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @IsNotEmpty()
  @IsEnum(AccessMethod)
  accessMethod!: AccessMethod;
}
