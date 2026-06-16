import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

export interface CreateAssetInput {
  courseId: string;
  accessMethod: AccessMethod;
}
