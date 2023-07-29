import React, { FunctionComponent } from 'react';
import { Alert, AlertProps, AlertVariant } from './Alert';

interface InfoAlertProps extends Omit<AlertProps, 'variant'> {}

export const InfoAlert: FunctionComponent<InfoAlertProps> = (props) => {
  const { children, ...remainingProps } = props;
  return (
    <Alert variant={AlertVariant.Info} {...remainingProps}>
      {children}
    </Alert>
  );
};
