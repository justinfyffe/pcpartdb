import { DateInput } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecDateFieldProps {
  field: SpecKey;

  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecDateField = forwardRef<HTMLInputElement, SpecDateFieldProps>(
  (props, ref) => {
    const { field, value, onChange } = props;

    const baseValue = value?.value ?? null;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(
          value != null ? { value, metadata: { specKey: field } } : null,
        );
      },
      [field, onChange],
    );

    return <DateInput value={baseValue} onChange={handleChange} ref={ref} />;
  },
);
SpecDateField.displayName = 'SpecDateField';
