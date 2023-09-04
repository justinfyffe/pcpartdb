import React, { FunctionComponent } from 'react';
import { Alert, AlertProps, AlertVariant } from './Alert';

interface SuccessAlertProps extends Omit<AlertProps, 'variant'> {}

export const SuccessAlert: FunctionComponent<SuccessAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Success} {...remainingProps}>
      {children}
    </Alert>
  );
};
