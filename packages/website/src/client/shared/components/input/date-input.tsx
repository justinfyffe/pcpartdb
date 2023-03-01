import React, { forwardRef } from 'react';
import { Input, InputProps } from './input';

export interface DateInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (props, ref) => {
    const { value, onChange, ...restProps } = props;

    return (
      <Input
        type="date"
        value={value != null ? value : ''}
        onChange={onChange}
        {...restProps}
        ref={ref}
      />
    );
  },
);
DateInput.displayName = 'DateInput';
