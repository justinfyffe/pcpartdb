import React, { forwardRef } from 'react';
import { Button, ButtonProps, ButtonVariant } from './Button';

export interface GenericButtonProps extends Omit<ButtonProps, 'variant'> {}

export const GenericButton = forwardRef<HTMLButtonElement, GenericButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Generic} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
GenericButton.displayName = 'GenericButton';
