import {
  formatProductField,
  hasProductFieldRawValue,
  ProductField,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { ProductFieldInput } from '../ProductFieldInput/ProductFieldInput';

interface ProductBooleanInputProps {
  productType: ProductType;
  fieldKey: ProductFieldKey;

  label?: string;
  value?: ProductField<boolean>;
  onChange?: (value: ProductField<boolean>) => void;

  disabled?: boolean;

  formatter?: (value: boolean) => string;
}

export const ProductBooleanInput = forwardRef<
  HTMLSelectElement,
  ProductBooleanInputProps
>((props, ref) => {
  const { productType, fieldKey, value, disabled, onChange, formatter } = props;

  const rawValue = useMemo(() => {
    if (hasProductFieldRawValue(value)) {
      return value.value ? 'true' : 'false';
    } else {
      return null;
    }
  }, [value]);
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const suggestedFormats = useMemo(() => {
    if (!hasProductFieldRawValue(value)) {
      return [];
    }

    const set = new Set<string>();
    set.add(formatter?.(productFieldRawValue(value)));
    set.add(
      formatProductField(productType, fieldKey, productFieldRawValue(value)),
    );

    return [...set.values()].filter((value) => value != null);
  }, [fieldKey, formatter, productType, value]);

  const handleValueChange = useCallback(
    (value: SelectValue) => {
      onChange?.({ value: value === 'true', meta: { ...meta, fieldKey } });
    },
    [onChange, meta, fieldKey],
  );

  return (
    <ProductFieldInput
      fieldKey={fieldKey}
      disabled={disabled}
      value={value}
      onChange={(field) => onChange?.(field as ProductField<boolean>)}
      suggestedFormats={suggestedFormats}
    >
      <Select
        placeholder="Raw Value"
        disabled={disabled}
        value={rawValue}
        onChange={handleValueChange}
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
    </ProductFieldInput>
  );
});
ProductBooleanInput.displayName = 'ProductBooleanInput';
