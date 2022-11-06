import { DateInput } from '@client/shared/components';
import { Spec } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecDateFieldProps {
  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecDateField = forwardRef<HTMLInputElement, SpecDateFieldProps>(
  (props, ref) => {
    const { value, onChange } = props;

    const baseValue = value?.value ?? null;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value != null ? { value } : null);
      },
      [onChange],
    );

    return <DateInput value={baseValue} onChange={handleChange} ref={ref} />;
  },
);
SpecDateField.displayName = 'SpecDateField';
