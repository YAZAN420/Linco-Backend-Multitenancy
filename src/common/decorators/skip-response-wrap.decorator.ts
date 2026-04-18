import { Reflector } from '@nestjs/core';
export const SkipResponseWrap = Reflector.createDecorator<void>();
