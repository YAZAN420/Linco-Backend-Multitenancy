import { Reflector } from '@nestjs/core';
import { DepartmentMemberRole } from 'src/generated/prisma/client';

export const DepartmentRoles =
  Reflector.createDecorator<DepartmentMemberRole[]>();
