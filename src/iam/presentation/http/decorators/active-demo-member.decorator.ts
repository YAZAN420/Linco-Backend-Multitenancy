import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';

export const ActiveDemoMember = createParamDecorator(
  (field: keyof ActiveDemoMemberData | undefined, _ctx: ExecutionContext) => {
    const cls = ClsServiceManager.getClsService<AppClsStore>();
    const member = cls.get(CLS_KEYS.DEMO_MEMBER);

    return field ? member?.[field] : member;
  },
);
