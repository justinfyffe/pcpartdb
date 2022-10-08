import React, { forwardRef, useCallback } from 'react';
import { Input, InputProps } from './input';

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value, onChange, ...restProps } = props;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value != null ? Number(value) : null);
      },
      [onChange],
    );

    return (
      <Input
        type="number"
        value={value != null ? `${value}` : ''}
        onChange={handleChange}
        {...restProps}
        ref={ref}
      />
    );
  },
);
NumberInput.displayName = 'NumberInput';

export interface NumberInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
}
