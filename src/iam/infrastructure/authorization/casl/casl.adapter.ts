import { Injectable } from '@nestjs/common';
import { subject } from '@casl/ability';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from 'src/generated/prisma/client';
import {
  AppAbility,
  AppSubjects,
  CaslAbilityFactory,
} from './casl-ability.factory';
import { AuthorizationPort } from '../../../application/ports/authorization.port';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { Action } from '../../../domain/enums/action.enum';

type AccessibleByResult = {
  [K in Prisma.ModelName]: Record<string, unknown>;
};

@Injectable()
export class CaslAdapter implements AuthorizationPort {
  private cachedAbility: AppAbility | null = null;
  private cachedUserId: string | null = null;

  constructor(private readonly caslFactory: CaslAbilityFactory) {}

  checkPermission(
    user: ActiveUserData,
    action: Action,
    subjectType: Prisma.ModelName,
    subjectInstance?: Record<string, unknown>,
  ): boolean {
    const ability = this.getAbility(user);

    if (subjectInstance) {
      const subjectWithType = subject(
        subjectType,
        subjectInstance,
      ) as unknown as AppSubjects;
      return ability.can(action, subjectWithType);
    }

    return ability.can(action, subjectType as unknown as AppSubjects);
  }

  buildQuery<M extends Prisma.ModelName>(
    user: ActiveUserData,
    action: Action,
    modelName: M,
  ): Record<string, unknown> {
    const ability = this.getAbility(user);

    const accessibleQueries = accessibleBy(
      ability,
      action,
    ) as AccessibleByResult;

    return accessibleQueries[modelName];
  }

  private getAbility(user: ActiveUserData): AppAbility {
    if (this.cachedAbility && this.cachedUserId === user.id) {
      return this.cachedAbility;
    }

    this.cachedAbility = this.caslFactory.createForUser(user);
    this.cachedUserId = user.id;
    return this.cachedAbility;
  }
}
