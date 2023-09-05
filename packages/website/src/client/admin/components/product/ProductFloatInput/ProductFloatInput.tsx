import {
  getBaseUnitValue,
  getDisplayUnitValue,
  getUnitFormat,
  hasProductFieldValue,
  MeasurementUnit,
  ProductField,
  ProductFieldKey,
} from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

interface ProductFloatInputProps {
  fieldKey: ProductFieldKey;

  units?: MeasurementUnit[];
  value?: ProductField<number>;
  onChange?: (value: ProductField<number>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductFloatInput = forwardRef<
  HTMLInputElement,
  ProductFloatInputProps
>((props, ref) => {
  const { fieldKey, value, placeholder, disabled, onChange } = props;

  const units = useMemo(() => props?.units || [], [props?.units]);
  const unit = useMemo(() => {
    return units.includes(value?.meta?.unit)
      ? value?.meta?.unit
      : units[0] ?? null;
  }, [units, value]);

  const [unitIndex, setUnitIndex] = useState(() =>
    units.length > 0 && unit != null ? units.indexOf(unit) : 0,
  );

  const displayValue = useMemo(() => {
    if (!hasProductFieldValue(value)) {
      return null;
    }

    return getDisplayUnitValue(value.value, unit);
  }, [value, unit]);

  const meta = useMemo(() => value?.meta || {}, [value?.meta]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.({
        value: getBaseUnitValue(value, unit),
        meta: { ...meta, fieldKey, unit: unit },
      });
    },
    [fieldKey, meta, unit, onChange],
  );

  const handleUnitClick = useCallback(() => {
    const newIndex = unitIndex < units.length - 1 ? unitIndex + 1 : 0;
    setUnitIndex(newIndex);
    const newValue: ProductField<number> = {
      value: getBaseUnitValue(displayValue, units[unitIndex]),
      meta: { ...meta, fieldKey, unit: units[unitIndex] },
    };

    onChange?.(newValue);
  }, [meta, unitIndex, units, displayValue, fieldKey, onChange]);

  return (
    <NumberInput
      placeholder={placeholder}
      disabled={disabled}
      value={displayValue}
      suffix={getUnitFormat(unit)}
      onChange={handleChange}
      onSuffixClick={handleUnitClick}
      ref={ref}
    />
  );
});
ProductFloatInput.displayName = 'ProductFloatInput';
