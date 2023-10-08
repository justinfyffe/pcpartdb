import {
  formatProductField,
  getBaseUnitValue,
  getUnitFormat,
  hasProductFieldRawValue,
  MeasurementUnit,
  ProductField,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
} from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { ProductFieldInput } from '../ProductFieldInput/ProductFieldInput';

interface ProductFloatInputProps {
  productType: ProductType;
  fieldKey: ProductFieldKey;

  units?: MeasurementUnit[];
  label?: string;
  value?: ProductField<number>;
  onChange?: (value: ProductField<number>) => void;

  placeholder?: string;
  disabled?: boolean;

  formatter?: (value: number) => string;
}

export const ProductFloatInput = forwardRef<
  HTMLInputElement,
  ProductFloatInputProps
>((props, ref) => {
  const {
    productType,
    fieldKey,
    label,
    value,
    placeholder,
    disabled,
    onChange,
    formatter,
  } = props;

  const units = useMemo(() => props?.units || [], [props?.units]);
  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const suggestedFormats = useMemo(() => {
    if (!hasProductFieldRawValue(value)) {
      return [];
    }

    const set = new Set<string>();
    set.add(formatter?.(productFieldRawValue(value)));
    units.forEach((unit) => {
      set.add(
        formatProductField(productType, fieldKey, productFieldRawValue(value), {
          displayUnit: unit,
        }),
      );
    });
    set.add(
      formatProductField(productType, fieldKey, productFieldRawValue(value)),
    );

    return [...set.values()].filter((value) => value != null);
  }, [fieldKey, formatter, productType, units, value]);

  const handleValueChange = useCallback(
    (value: number) => {
      onChange?.({ value, meta: { ...meta, fieldKey } });
    },
    [meta, onChange, fieldKey],
  );

  const handleApplyUnit = useCallback(
    (unit: MeasurementUnit) => {
      if (!hasProductFieldRawValue(value)) {
        return;
      }

      const rawValue = productFieldRawValue(value);
      const newValue = getBaseUnitValue(rawValue, unit);
      onChange?.({ value: newValue, meta });
    },
    [meta, onChange, value],
  );

  return (
    <ProductFieldInput
      fieldKey={fieldKey}
      disabled={disabled}
      label={label}
      value={value}
      onChange={(field) => onChange?.(field as ProductField<number>)}
      suggestedFormats={suggestedFormats}
    >
      <NumberInput
        placeholder={placeholder}
        disabled={disabled}
        value={rawValue}
        onChange={handleValueChange}
        ref={ref}
      />

      <div className="flex gap-2 items-end justify-end text-xs">
        {units != null && units.length > 0 && <span>Calculate: </span>}
        {units?.map((unit, i) => (
          <React.Fragment key={unit}>
            {i > 0 && <> &bull; </>}
            <a onClick={() => handleApplyUnit(unit)} className="cursor-pointer">
              {getUnitFormat(unit)}
            </a>
          </React.Fragment>
        ))}
      </div>
    </ProductFieldInput>
  );
});
ProductFloatInput.displayName = 'ProductFloatInput';
