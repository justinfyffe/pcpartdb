import { ApiError, HttpErrorType } from '@pcpartdb/shared';
import React from 'react';
import { ForbiddenErrorPage } from '../ForbiddenErrorPage/ForbiddenErrorPage';

interface ErrorPageProps {
  error: ApiError;
}

export function ErrorPage(props: ErrorPageProps) {
  const { error } = props;

  console.error(error);

  if (error?.type === HttpErrorType.ForbiddenError) {
    return <ForbiddenErrorPage error={error} />;
  }

  return <></>;
}
