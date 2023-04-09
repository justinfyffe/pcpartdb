import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { NumberInput } from '../../../../shared/components';

const CURRENCIES = ['USD'];

interface GpuCurrencyFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<number>;
  onChange?: (value: GpuField<number>) => void;
}

export const GpuCurrencyFieldInput = forwardRef<
  HTMLInputElement,
  GpuCurrencyFieldInputProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const currency = useMemo(() => {
    return CURRENCIES.includes(value?.meta?.currency)
      ? value?.meta?.currency
      : CURRENCIES[0] ?? null;
  }, [value]);

  const [currencyIndex, setCurrencyIndex] = useState(() =>
    CURRENCIES.length > 0 && currency != null
      ? CURRENCIES.indexOf(currency)
      : 0,
  );

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(
        value != null ? { value, meta: { fieldKey: field, currency } } : null,
      );
    },
    [field, currency, onChange],
  );

  const handleCurrencyClick = useCallback(() => {
    const newIndex =
      currencyIndex < CURRENCIES.length - 1 ? currencyIndex + 1 : 0;
    setCurrencyIndex(newIndex);
    const newValue: GpuField<number> = {
      value: baseValue,
      meta: { fieldKey: field, currency: CURRENCIES[currencyIndex] },
    };

    onChange?.(newValue);
  }, [baseValue, field, currencyIndex, onChange]);

  return (
    <NumberInput
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      suffix={currency}
      onChange={handleChange}
      onSuffixClick={handleCurrencyClick}
      ref={ref}
    />
  );
});
GpuCurrencyFieldInput.displayName = 'GpuCurrencyFieldInput';
