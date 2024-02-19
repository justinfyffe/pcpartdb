import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { ButtonVariant } from './types';

export interface InfoButtonProps extends Omit<ButtonProps, 'variant'> {}

export const InfoButton = forwardRef<HTMLButtonElement, InfoButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Info} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
InfoButton.displayName = 'InfoButton';
