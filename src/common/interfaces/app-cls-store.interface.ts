import { ClsStore } from 'nestjs-cls';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CLS_KEYS } from '../constants/cls-keys.constant';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';
import { ActiveDepartmentMemberData } from 'src/iam/domain/interfaces/active-department-member.interface copy';

export interface AppClsStore extends ClsStore {
  [CLS_KEYS.USER]?: ActiveUserData;
  [CLS_KEYS.DEMO_MEMBER]?: ActiveDemoMemberData;
  [CLS_KEYS.DEPARTMENT_MEMBER]?: ActiveDepartmentMemberData;
  [CLS_KEYS.DEMO_ID]?: string;
  [CLS_KEYS.DEPARTMENT_ID]?: string;
}
