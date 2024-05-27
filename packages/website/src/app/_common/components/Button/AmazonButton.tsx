import React, { forwardRef } from 'react';
import { classNames } from '../../utils/classNames';
import { Button, ButtonProps } from './Button';

export interface AmazonButtonProps extends Omit<ButtonProps, 'variant'> {}

export const AmazonButton = forwardRef<HTMLButtonElement, AmazonButtonProps>(
  (props, ref) => {
    const { children, className, ...remainingProps } = props;

    return (
      <Button
        className={classNames(
          'bg-[#f78900] hover:bg-[#ed8300] text-white font-medium shadow-md shadowed-text',
          className,
        )}
        ref={ref}
        {...remainingProps}
      >
        {children}
      </Button>
    );
  },
);
AmazonButton.displayName = 'AmazonButton';
