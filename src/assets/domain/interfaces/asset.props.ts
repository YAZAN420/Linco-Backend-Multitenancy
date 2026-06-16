import { AccessMethod } from '../enums/access-method.enum';

export interface AssetProps {
  demoId: string;
  courseId: string;
  accessMethod: AccessMethod;
  acquiredAt: Date;
  updatedAt: Date;
}
