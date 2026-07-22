import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { ActiveDepartmentMemberData } from 'src/iam/domain/interfaces/active-department-member.interface';

export const ActiveDepartmentMember = createParamDecorator(
  (
    field: keyof ActiveDepartmentMemberData | undefined,
    _ctx: ExecutionContext,
  ) => {
    const cls = ClsServiceManager.getClsService<AppClsStore>();
    const member = cls.get(CLS_KEYS.DEPARTMENT_MEMBER);

    return field ? member?.[field] : member;
  },
);
