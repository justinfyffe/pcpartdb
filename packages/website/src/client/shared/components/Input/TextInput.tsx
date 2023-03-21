import React, { forwardRef, useCallback } from 'react';
import { Input, InputProps } from './Input';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { onChange, ...restProps } = props;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value !== '' ? value : null);
      },
      [onChange],
    );

    return (
      <Input type="text" onChange={handleChange} {...restProps} ref={ref} />
    );
  },
);
TextInput.displayName = 'TextInput';

export interface TextInputProps extends Omit<InputProps, 'type'> {}
