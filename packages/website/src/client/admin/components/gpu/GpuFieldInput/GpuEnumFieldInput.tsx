import { GpuField, GpuFieldKey, MarketSegmentValue } from '@pcpartdb/shared';
import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components';

const ITEMS: { [key: string]: { label: string; value: string }[] } = {
  marketSegment: [
    { label: 'Desktop', value: MarketSegmentValue.Desktop },
    { label: 'Mobile', value: MarketSegmentValue.Mobile },
    { label: 'Workstation', value: MarketSegmentValue.Workstation },
    { label: 'Integrated', value: MarketSegmentValue.Integrated },
  ],
};

interface GpuEnumFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuEnumFieldInput = forwardRef<
  HTMLSelectElement,
  GpuEnumFieldInputProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const items = useMemo(() => ITEMS[field] ?? [], [field]);

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (value != null && typeof value != 'string') {
        throw new Error('Invalid select value for SpecEnumField');
      }

      onChange?.({ value: value as string, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <Select
      disabled={value?.meta?.autoUpdate}
      value={baseValue}
      onChange={handleChange}
      clearable
      ref={ref}
    >
      {items.map((item) => (
        <SelectOption key={item.value} label={item.label} value={item.value}>
          {item.label}
        </SelectOption>
      ))}
    </Select>
  );
});
GpuEnumFieldInput.displayName = 'GpuEnumFieldInput';
