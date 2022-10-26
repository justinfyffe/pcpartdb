import { Select, SelectOption, SelectValue } from '@client/shared/components';
import { SpecKey, SpecRequest } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecStringFieldProps {
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecBooleanField = forwardRef<
  HTMLSelectElement,
  SpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  let baseValue: string = null;
  if (value?.booleanValue != null) {
    baseValue = value?.booleanValue ? 'true' : 'false';
  }

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (typeof value != 'string') {
        throw new Error('Invalid select value for SpecBooleanField');
      }

      onChange?.(
        value != null ? { key: field, booleanValue: value === 'true' } : null,
      );
    },
    [field, onChange],
  );

  return (
    <Select value={baseValue} onChange={handleChange} clearable ref={ref}>
      <SelectOption label="True" value="true">
        True
      </SelectOption>
      <SelectOption label="False" value="false">
        False
      </SelectOption>
    </Select>
  );
});
SpecBooleanField.displayName = 'SpecBooleanField';
