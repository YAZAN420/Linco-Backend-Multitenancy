import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { Action } from '../../../domain/enums/action.enum';
import { Role } from 'src/users/domain/enums/role.enum';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { subjects } from './casl-subjects';

type Subjects = InferSubjects<(typeof subjects)[number]> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: ActiveUserData) {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === Role.ADMIN) {
      builder.can(Action.Manage, 'all');
    } else {
      this.applyUserPolicies(user, builder);
    }

    return builder.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private applyUserPolicies(
    user: ActiveUserData,
    builder: AbilityBuilder<AppAbility>,
  ) {
    const { can } = builder;
    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });
  }
}
