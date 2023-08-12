import React, { forwardRef } from 'react';
import { Button, ButtonProps, ButtonVariant } from './Button';

export interface DangerButtonProps extends Omit<ButtonProps, 'variant'> {}

export const DangerButton = forwardRef<HTMLButtonElement, DangerButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Danger} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
DangerButton.displayName = 'DangerButton';
