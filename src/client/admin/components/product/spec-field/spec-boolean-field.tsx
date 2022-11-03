import { Select, SelectOption, SelectValue } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecStringFieldProps {
  field: SpecKey;

  value?: Spec<boolean>;
  onChange?: (value: Spec<boolean>) => void;
}

export const SpecBooleanField = forwardRef<
  HTMLSelectElement,
  SpecStringFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  let baseValue: string = null;
  if (value?.value != null) {
    baseValue = value?.value ? 'true' : 'false';
  }

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (typeof value != 'string') {
        throw new Error('Invalid select value for SpecBooleanField');
      }

      onChange?.(
        value != null
          ? { value: value === 'true', metadata: { specKey: field } }
          : null,
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
