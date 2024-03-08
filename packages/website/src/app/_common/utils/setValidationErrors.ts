import { ApiError, isBadRequestError } from '@pcpartdb/shared';
import { UseFormSetError } from 'react-hook-form';

export function setValidationErrors<T>(
  error: ApiError,
  setError: UseFormSetError<T>,
) {
  if (!isBadRequestError(error)) {
    return;
  }

  error.data?.forEach((validationError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError(validationError.property as any, {
      type: validationError.constraint,
    });
  });
}
