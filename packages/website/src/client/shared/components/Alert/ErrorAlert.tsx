import React, { FunctionComponent } from 'react';
import { Alert, AlertProps, AlertVariant } from './Alert';

interface ErrorAlertProps extends Omit<AlertProps, 'variant'> {}

export const ErrorAlert: FunctionComponent<ErrorAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Error} {...remainingProps}>
      {children}
    </Alert>
  );
};
