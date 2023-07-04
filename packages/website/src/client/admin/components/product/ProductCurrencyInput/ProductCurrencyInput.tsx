import { ProductField, ProductFieldKey } from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { NumberInput } from '../../../../shared/components';

const CURRENCIES = ['USD'];

interface ProductCurrencyInputProps {
  fieldKey: ProductFieldKey;

  value?: ProductField<number>;
  onChange?: (value: ProductField<number>) => void;

  placeholder?: string;
  disabled?: boolean;
}

export const ProductCurrencyInput = forwardRef<
  HTMLInputElement,
  ProductCurrencyInputProps
>((props, ref) => {
  const { fieldKey, value, placeholder, disabled, onChange } = props;

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

  const rawValue = value?.value ?? null;
  const meta = useMemo(() => value?.meta, [value?.meta]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.({ value, meta: { ...meta, fieldKey, currency } });
    },
    [fieldKey, meta, currency, onChange],
  );

  const handleCurrencyClick = useCallback(() => {
    const newIndex =
      currencyIndex < CURRENCIES.length - 1 ? currencyIndex + 1 : 0;
    setCurrencyIndex(newIndex);
    const newValue: ProductField<number> = {
      value: rawValue,
      meta: { ...meta, fieldKey, currency: CURRENCIES[currencyIndex] },
    };

    onChange?.(newValue);
  }, [rawValue, fieldKey, meta, currencyIndex, onChange]);

  return (
    <NumberInput
      placeholder={placeholder}
      disabled={disabled}
      value={rawValue}
      suffix={currency}
      onChange={handleChange}
      onSuffixClick={handleCurrencyClick}
      ref={ref}
    />
  );
});
ProductCurrencyInput.displayName = 'ProductCurrencyInput';
