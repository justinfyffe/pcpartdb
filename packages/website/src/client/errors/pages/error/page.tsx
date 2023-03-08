import 'reflect-metadata';
import { ApiError, HttpErrorType } from '@pcpartdb/shared';
import React from 'react';
import { GeneralErrorPage } from '../general-error';
import { NotFoundPage } from '../not-found';

export interface ErrorPageProps {
  error: ApiError;
}

export const ErrorPage = (props: ErrorPageProps) => {
  const { error } = props;

  if (error.type === HttpErrorType.NotFoundError) {
    return <NotFoundPage />;
  } else {
    return <GeneralErrorPage />;
  }
};
