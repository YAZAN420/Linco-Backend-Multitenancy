import { Reflector } from '@nestjs/core';

export const ClearCache = Reflector.createDecorator<string | string[]>();
