import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { ButtonVariant } from './types';

export interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Primary} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
PrimaryButton.displayName = 'PrimaryButton';
