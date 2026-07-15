import { Reflector } from '@nestjs/core';
import { DemoMemberRole } from 'src/generated/prisma/client';

export const DemoRoles = Reflector.createDecorator<DemoMemberRole[]>();
