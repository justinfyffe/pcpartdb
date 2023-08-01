import React, { FunctionComponent } from 'react';
import { Alert, AlertProps, AlertVariant } from './Alert';

interface WarningAlertProps extends Omit<AlertProps, 'variant'> {}

export const WarningAlert: FunctionComponent<WarningAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Warning} {...remainingProps}>
      {children}
    </Alert>
  );
};
