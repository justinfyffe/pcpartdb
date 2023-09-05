import {
  hasProductFieldValue,
  ProductField,
  ProductFieldKey,
} from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface ProductBooleanInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<boolean>;
  onChange?: (value: ProductField<boolean>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductBooleanInput = forwardRef<
  HTMLSelectElement,
  ProductBooleanInputProps
>((props, ref) => {
  const { fieldKey, value, placeholder, disabled, onChange } = props;

  const rawValue = useMemo(() => {
    if (hasProductFieldValue(value)) {
      return value.value ? 'true' : 'false';
    } else {
      return null;
    }
  }, [value]);
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const handleChange = useCallback(
    (newValue: SelectValue) => {
      onChange?.({
        value: newValue === 'true',
        meta: { ...meta, fieldKey },
      });
    },
    [fieldKey, meta, onChange],
  );

  return (
    <Select
      placeholder={placeholder}
      disabled={disabled}
      value={rawValue}
      onChange={handleChange}
      clearable
      ref={ref}
    >
      <SelectOption label="True" value="true">
        True
      </SelectOption>
      <SelectOption label="False" value="false">
        False
      </SelectOption>
    </Select>
  );
});
ProductBooleanInput.displayName = 'ProductBooleanInput';
