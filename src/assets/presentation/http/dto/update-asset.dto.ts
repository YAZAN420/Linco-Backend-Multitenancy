import { IsEnum, IsOptional } from 'class-validator';
import { UpdateAssetInput } from 'src/assets/application/interfaces/update-asset-input.interface';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

export class UpdateAssetDto implements UpdateAssetInput {
  @IsEnum(AccessMethod)
  @IsOptional()
  accessMethod?: AccessMethod;
}
