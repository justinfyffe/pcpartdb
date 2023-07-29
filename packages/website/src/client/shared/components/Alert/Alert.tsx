import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

export enum AlertVariant {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

export interface AlertProps {
  as?: React.ElementType;
  className?: string;
  variant?: AlertVariant;

  children?: React.ReactNode;
}

const ALERT_VARIANTS = {
  [AlertVariant.Error]: 'bg-danger text-default',
  [AlertVariant.Info]: 'bg-info text-default',
  [AlertVariant.Success]: 'bg-success text-default',
};

export const Alert: FunctionComponent<AlertProps> = (props) => {
  const Element = props.as || 'div';
  const variant = props.variant ?? AlertVariant.Info;

  return (
    <Element
      className={classNames(
        'block mb-4 px-6 py-4 rounded no-underline',
        ALERT_VARIANTS[variant],
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
