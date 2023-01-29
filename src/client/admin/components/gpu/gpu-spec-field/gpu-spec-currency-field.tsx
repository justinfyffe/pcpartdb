import { NumberInput } from '@client/shared/components';
import { GpuSpec, GpuSpecKey } from '@shared/gpus';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const CURRENCIES = ['USD'];

interface GpuSpecCurrencyFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<number>;
  onChange?: (value: GpuSpec<number>) => void;
}

export const GpuSpecCurrencyField = forwardRef<
  HTMLInputElement,
  GpuSpecCurrencyFieldProps
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
        value != null ? { value, meta: { specKey: field, currency } } : null,
      );
    },
    [field, currency, onChange],
  );

  const handleCurrencyClick = useCallback(() => {
    const newIndex =
      currencyIndex < CURRENCIES.length - 1 ? currencyIndex + 1 : 0;
    setCurrencyIndex(newIndex);
    const newValue: GpuSpec<number> = {
      value: baseValue,
      meta: { specKey: field, currency: CURRENCIES[currencyIndex] },
    };

    onChange?.(newValue);
  }, [baseValue, field, currencyIndex, onChange]);

  return (
    <NumberInput
      value={baseValue}
      suffix={currency}
      onChange={handleChange}
      onSuffixClick={handleCurrencyClick}
      ref={ref}
    />
  );
});
GpuSpecCurrencyField.displayName = 'GpuSpecCurrencyField';
