import React, { FunctionComponent } from 'react';
import { Alert, AlertProps } from './Alert';
import { AlertVariant } from './types';

interface WarningAlertProps extends Omit<AlertProps, 'variant'> {}

export const WarningAlert: FunctionComponent<WarningAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Warning} {...remainingProps}>
      {children}
    </Alert>
  );
};
