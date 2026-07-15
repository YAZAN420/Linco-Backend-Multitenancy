import { ClsStore } from 'nestjs-cls';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CLS_KEYS } from '../constants/cls-keys.constant';

export interface AppClsStore extends ClsStore {
  [CLS_KEYS.USER]?: ActiveUserData;
  [CLS_KEYS.DEMO_ID]?: string;
  [CLS_KEYS.DEPARTMENT_ID]?: string;
}
