import { DateInput } from '@client/shared/components';
import { SpecKey, SpecRequest } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecDateFieldProps {
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecDateField = forwardRef<HTMLInputElement, SpecDateFieldProps>(
  (props, ref) => {
    const { field, value, onChange } = props;

    const baseValue = value?.stringValue ?? null;

    const handleChange = useCallback(
      (value: string) => {
        onChange?.(value != null ? { key: field, stringValue: value } : null);
      },
      [field, onChange],
    );

    return <DateInput value={baseValue} onChange={handleChange} ref={ref} />;
  },
);
SpecDateField.displayName = 'SpecDateField';
