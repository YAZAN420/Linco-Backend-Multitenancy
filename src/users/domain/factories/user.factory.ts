import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { User } from '../user';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UserFactory {
  createNew(usernameStr: string, emailStr: string, password: string): User {
    const email = new Email(emailStr);
    const username = new Username(usernameStr);
    const now = new Date();

    return new User(
      uuidv7(),
      username,
      email,
      Role.USER,
      password,
      now,
      now,
      false,
      false,
    );
  }
}
