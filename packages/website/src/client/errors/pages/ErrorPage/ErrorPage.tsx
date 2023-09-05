import 'reflect-metadata';
import { ApiError, HttpErrorType } from '@pcpartdb/shared';
import React from 'react';
import { GeneralErrorPage } from '../GeneralErrorPage/GeneralErrorPage';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';

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
