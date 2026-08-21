import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import type { TranslatableMessage } from '../interfaces/translatable-message.interface';

const validationKeys: Record<string, string> = {
  arrayMaxSize: 'validation.ARRAY_MAX_SIZE',
  isArray: 'validation.IS_ARRAY',
  isBoolean: 'validation.IS_BOOLEAN',
  isDate: 'validation.IS_DATE',
  isDateString: 'validation.IS_DATE_STRING',
  isEmail: 'validation.IS_EMAIL',
  isEnum: 'validation.IS_ENUM',
  isInt: 'validation.IS_INT',
  isLength: 'validation.LENGTH',
  isNotEmpty: 'validation.IS_NOT_EMPTY',
  isNumber: 'validation.IS_NUMBER',
  isObject: 'validation.IS_OBJECT',
  isPositive: 'validation.IS_POSITIVE',
  isString: 'validation.IS_STRING',
  matches: 'validation.MATCHES',
  max: 'validation.MAX',
  maxLength: 'validation.MAX_LENGTH',
  min: 'validation.MIN',
  minLength: 'validation.MIN_LENGTH',
  nestedValidation: 'validation.NESTED_VALIDATION',
  notEquals: 'validation.NOT_EQUALS',
};

const translationKeyPattern = /^(?:errors|messages|validation)\.[A-Z0-9_]+$/;

function toMessages(
  errors: ValidationError[],
  parentPath?: string,
): TranslatableMessage[] {
  return errors.flatMap((error) => {
    const property = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const messages = Object.entries(error.constraints ?? {}).map(
      ([constraint, configuredMessage]): TranslatableMessage => ({
        key: translationKeyPattern.test(configuredMessage)
          ? configuredMessage
          : (validationKeys[constraint] ?? 'validation.INVALID'),
        args: { property },
      }),
    );

    if (error.children?.length) {
      messages.push(...toMessages(error.children, property));
    }

    return messages;
  });
}

export function createValidationException(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException({ message: toMessages(errors) });
}
