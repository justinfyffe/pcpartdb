import React, { forwardRef } from 'react';
import { Button, ButtonProps, ButtonVariant } from './Button';

export interface WarningButtonProps extends Omit<ButtonProps, 'variant'> {}

export const WarningButton = forwardRef<HTMLButtonElement, WarningButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Warning} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
WarningButton.displayName = 'WarningButton';
