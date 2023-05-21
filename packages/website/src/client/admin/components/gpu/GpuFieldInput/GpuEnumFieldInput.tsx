import {
  GpuField,
  GpuFieldKey,
  MarketSegmentValue,
  ProductionStatusValue,
} from '@pcpartdb/shared';
import {
  formatGpuField,
  formatMarketSegment,
  formatProductionStatus,
} from 'packages/website/src/client/gpus';
import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components';

const ITEMS: { [key: string]: { label: string; value: string }[] } = {
  marketSegment: [
    {
      label: formatMarketSegment(MarketSegmentValue.Desktop),
      value: MarketSegmentValue.Desktop,
    },
    {
      label: formatMarketSegment(MarketSegmentValue.Mobile),
      value: MarketSegmentValue.Mobile,
    },
    {
      label: formatMarketSegment(MarketSegmentValue.Workstation),
      value: MarketSegmentValue.Workstation,
    },
    {
      label: formatMarketSegment(MarketSegmentValue.Integrated),
      value: MarketSegmentValue.Integrated,
    },
  ],
  productionStatus: [
    {
      label: formatProductionStatus(ProductionStatusValue.Unreleased),
      value: ProductionStatusValue.Unreleased,
    },
    {
      label: formatProductionStatus(ProductionStatusValue.Active),
      value: ProductionStatusValue.Active,
    },
    {
      label: formatProductionStatus(ProductionStatusValue.EndOfLife),
      value: ProductionStatusValue.EndOfLife,
    },
  ],
};

interface GpuEnumFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<string>;
  parentValue?: GpuField<string>;
  onChange?: (value: GpuField<string>) => void;
}

export const GpuEnumFieldInput = forwardRef<
  HTMLSelectElement,
  GpuEnumFieldInputProps
>((props, ref) => {
  const { field, value, parentValue, onChange } = props;

  const items = useMemo(() => ITEMS[field] ?? [], [field]);

  const baseValue = value?.value ?? null;
  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (value != null && typeof value != 'string') {
        throw new Error('Invalid select value for GpuEnumFieldInput');
      }

      onChange?.({ value: value as string, meta: { fieldKey: field } });
    },
    [field, onChange],
  );

  return (
    <Select
      placeholder={placeholder}
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
