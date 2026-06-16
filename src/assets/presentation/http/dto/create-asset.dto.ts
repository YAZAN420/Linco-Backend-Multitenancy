import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAssetInput } from 'src/assets/application/interfaces/create-asset-input.interface';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

export class CreateAssetDto implements CreateAssetInput {
  @IsUUID()
  @IsNotEmpty()
  courseId!: string;

  accessMethod: AccessMethod = AccessMethod.PURCHASED;
}
