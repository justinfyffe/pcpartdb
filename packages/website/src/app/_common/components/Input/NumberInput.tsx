'use client';

import React, { forwardRef, useCallback, WheelEvent } from 'react';
import { Input, InputProps } from './Input';

export interface NumberInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value, onChange, ...restProps } = props;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value != null ? Number(value) : null);
      },
      [onChange],
    );

    const handleWheel = useCallback((e?: WheelEvent<HTMLInputElement>) => {
      e?.currentTarget.blur();
    }, []);

    return (
      <Input
        type="number"
        value={value != null ? `${value}` : ''}
        onChange={handleChange}
        onWheel={handleWheel}
        {...restProps}
        ref={ref}
      />
    );
  },
);
NumberInput.displayName = 'NumberInput';
