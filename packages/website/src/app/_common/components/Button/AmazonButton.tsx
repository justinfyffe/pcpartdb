import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';

export interface AmazonButtonProps extends Omit<ButtonProps, 'variant'> {}

export const AmazonButton = forwardRef<HTMLButtonElement, AmazonButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button
        className="bg-[#f78900] hover:bg-[#f98a00] text-white font-medium shadow-md shadowed-text"
        ref={ref}
        {...remainingProps}
      >
        {children}
      </Button>
    );
  },
);
AmazonButton.displayName = 'AmazonButton';
