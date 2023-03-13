import { TypeORMError } from 'typeorm';

const DUPLICATE_CODE = '23505';

interface IDuplicateError extends TypeORMError {
  code: typeof DUPLICATE_CODE;
}

export function isDuplicateError(error: unknown): error is IDuplicateError {
  if (error instanceof TypeORMError && 'code' in error) {
    return error.code === DUPLICATE_CODE;
  }
  return false;
}
