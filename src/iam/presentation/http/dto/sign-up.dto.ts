import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/presentation/http/dto/create-user.dto';

export class SignUpDto extends OmitType(CreateUserDto, [
  'role',
  'isEmailVerified',
] as const) {}
