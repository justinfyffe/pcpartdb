import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

export enum AlertVariant {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

interface AlertProps {
  as?: React.ElementType;
  className?: string;
  variant?: AlertVariant;

  children?: React.ReactNode;
}

const ALERT_VARIANTS = {
  [AlertVariant.Info]: 'bg-[#f0f0f0] text-black',
  [AlertVariant.Error]: 'bg-[#b00020] text-white',
  [AlertVariant.Success]: 'bg-[#007e33] text-white',
};

export const Alert: FunctionComponent<AlertProps> = (props) => {
  const Element = props.as || 'div';
  const variant = props.variant || AlertVariant.Info;

  return (
    <Element
      className={classNames(
        'bg-transparent block mb-4 no-underline px-6 py-4 rounded text-[#333]',
        ALERT_VARIANTS[variant],
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
