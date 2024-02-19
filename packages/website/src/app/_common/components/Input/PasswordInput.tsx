'use client';

import React, { forwardRef, useCallback } from 'react';
import { Input, InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  onChange?: (value: string) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const { onChange, ...restProps } = props;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value !== '' ? value : null);
      },
      [onChange],
    );

    return (
      <Input type="password" onChange={handleChange} {...restProps} ref={ref} />
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
