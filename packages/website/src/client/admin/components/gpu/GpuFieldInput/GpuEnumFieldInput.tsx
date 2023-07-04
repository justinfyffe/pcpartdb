import {
  GpuField,
  GpuFieldKey,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
} from '@pcpartdb/shared';
import {
  formatGpuField,
  formatGpuMarketSegment,
  formatGpuProductionStatus,
} from 'packages/website/src/client/product';
import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components';

const ITEMS: { [key: string]: { label: string; value: string }[] } = {
  marketSegment: [
    {
      label: formatGpuMarketSegment(GpuMarketSegmentValue.Desktop),
      value: GpuMarketSegmentValue.Desktop,
    },
    {
      label: formatGpuMarketSegment(GpuMarketSegmentValue.Mobile),
      value: GpuMarketSegmentValue.Mobile,
    },
    {
      label: formatGpuMarketSegment(GpuMarketSegmentValue.Workstation),
      value: GpuMarketSegmentValue.Workstation,
    },
    {
      label: formatGpuMarketSegment(GpuMarketSegmentValue.Integrated),
      value: GpuMarketSegmentValue.Integrated,
    },
  ],
  productionStatus: [
    {
      label: formatGpuProductionStatus(GpuProductionStatusValue.Unreleased),
      value: GpuProductionStatusValue.Unreleased,
    },
    {
      label: formatGpuProductionStatus(GpuProductionStatusValue.Active),
      value: GpuProductionStatusValue.Active,
    },
    {
      label: formatGpuProductionStatus(GpuProductionStatusValue.EndOfLife),
      value: GpuProductionStatusValue.EndOfLife,
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
