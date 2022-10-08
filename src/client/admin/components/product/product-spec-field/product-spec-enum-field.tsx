import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  MarketSegment,
  ProductionStatus,
  ProductSpecKey,
  ProductSpecRequest,
} from '../../../../../shared/product-spec';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../../shared/components/select';

const ITEMS: { [key: string]: { label: string; value: string }[] } = {
  [ProductSpecKey.MarketSegment]: [
    { label: 'Desktop', value: MarketSegment.Desktop },
    { label: 'Laptop', value: MarketSegment.Laptop },
    { label: 'Server', value: MarketSegment.Server },
  ],
  [ProductSpecKey.ProductionStatus]: [
    { label: 'Active', value: ProductionStatus.Active },
    { label: 'End-Of-Life', value: ProductionStatus.EndOfLife },
    { label: 'Unreleased', value: ProductionStatus.Unreleased },
  ],
};

interface ProductSpecEnumFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecEnumField = forwardRef<
  HTMLSelectElement,
  ProductSpecEnumFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const items = useMemo(() => ITEMS[field] ?? [], [field]);

  const baseValue = value?.stringValue ?? null;

  const handleChange = useCallback(
    (value: SelectValue) => {
      if (value != null && typeof value != 'string') {
        throw new Error('Invalid select value for ProductSpecEnumField');
      }

      onChange?.(
        value != null ? { key: field, stringValue: value as string } : null,
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
ProductSpecEnumField.displayName = 'ProductSpecEnumField';
