import { Select, SelectOption, SelectValue } from '@client/shared/components';
import { GpuField, MarketSegmentValue } from '@shared/gpus';
import React, { forwardRef, useCallback, useMemo } from 'react';

const ITEMS: { [key: string]: { label: string; value: string }[] } = {
  marketSegment: [
    { label: 'Desktop', value: MarketSegmentValue.Desktop },
    { label: 'Laptop', value: MarketSegmentValue.Laptop },
    { label: 'Server', value: MarketSegmentValue.Server },
  ],
};

interface GpuSpecEnumFieldProps {
  field: string;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuSpecEnumField = forwardRef<
  HTMLSelectElement,
  GpuSpecEnumFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const items = useMemo(() => ITEMS[field] ?? [], [field]);

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (value != null && typeof value != 'string') {
        throw new Error('Invalid select value for SpecEnumField');
      }

      onChange?.(
        value != null
          ? { value: value as string, meta: { fieldKey: field } }
          : null,
      );
    },
    [field, onChange],
  );

  return (
    <Select value={baseValue} onChange={handleChange} clearable ref={ref}>
      {items.map((item) => (
        <SelectOption key={item.value} label={item.label} value={item.value}>
          {item.label}
        </SelectOption>
      ))}
    </Select>
  );
});
GpuSpecEnumField.displayName = 'GpuSpecEnumField';
