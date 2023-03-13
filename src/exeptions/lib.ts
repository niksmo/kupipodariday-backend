import { DUPLICATE_CODE } from 'const';
import { TypeORMError } from 'typeorm';

interface IDuplicateError extends TypeORMError {
  code: typeof DUPLICATE_CODE;
}

export function isDuplicateError(error: unknown): error is IDuplicateError {
  if (error instanceof TypeORMError && 'code' in error) {
    return error.code === DUPLICATE_CODE;
  }
  return false;
}
