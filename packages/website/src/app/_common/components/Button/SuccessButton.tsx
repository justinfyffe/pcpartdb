import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { ButtonVariant } from './types';

export interface SuccessButtonProps extends Omit<ButtonProps, 'variant'> {}

export const SuccessButton = forwardRef<HTMLButtonElement, SuccessButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button variant={ButtonVariant.Success} ref={ref} {...remainingProps}>
        {children}
      </Button>
    );
  },
);
SuccessButton.displayName = 'SuccessButton';
