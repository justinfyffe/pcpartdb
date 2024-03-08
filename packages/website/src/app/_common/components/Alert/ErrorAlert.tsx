import React, { FunctionComponent } from 'react';
import { Alert, AlertProps } from './Alert';
import { AlertVariant } from './types';

interface ErrorAlertProps extends Omit<AlertProps, 'variant'> {}

export const ErrorAlert: FunctionComponent<ErrorAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Error} {...remainingProps}>
      {children}
    </Alert>
  );
};
