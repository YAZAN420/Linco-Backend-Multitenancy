import { Prisma } from 'src/generated/prisma/client';
import { Action } from '../../domain/enums/action.enum';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';

export abstract class AuthorizationPort {
  abstract checkPermission(
    user: ActiveUserData,
    action: Action,
    subjectType: Prisma.ModelName,
    subjectInstance?: Record<string, unknown>,
  ): boolean;

  abstract buildQuery<M extends Prisma.ModelName>(
    user: ActiveUserData,
    action: Action,
    modelName: M,
  ): Record<string, unknown>;
}
