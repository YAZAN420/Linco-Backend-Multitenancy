import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/generated/prisma/client';
import { Action } from '../../../domain/enums/action.enum';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { Role } from 'src/users/domain/enums/role.enum';

export type AppSubjects =
  | Subjects<{
      User: User;
    }>
  | Prisma.ModelName
  | 'all';

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: ActiveUserData): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, Prisma.ModelName.User, { id: user.id });
      can(Action.Update, Prisma.ModelName.User, { id: user.id });
    }

    return build();
  }
}
