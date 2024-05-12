import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';

export interface AmazonButtonProps extends Omit<ButtonProps, 'variant'> {}

export const AmazonButton = forwardRef<HTMLButtonElement, AmazonButtonProps>(
  (props, ref) => {
    const { children, ...remainingProps } = props;

    return (
      <Button
        className="bg-[#FF9900] hover:bg-[#ef9900] text-black font-medium shadow-md"
        ref={ref}
        {...remainingProps}
      >
        {children}
      </Button>
    );
  },
);
AmazonButton.displayName = 'AmazonButton';
