import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ProductPropertyType } from '../../../types/product';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import { AutocompleteValue } from '../../shared/components/autocomplete';
import { Input } from '../../shared/components/input';
import { ProductPropertyAutocomplete } from './product-property-autocomplete';

interface ParsedValue {
  baseValue: string | number;
  suffixValue?: string;
}

const SUFFIXES: { [key: string]: string[] } = {
  [ProductSpecKey.LaunchPrice]: ['USD'],
  [ProductSpecKey.Lithography]: ['nm', 'μm'],
  [ProductSpecKey.Transistors]: ['millions'],
  [ProductSpecKey.DieSize]: ['mm^2'],
  [ProductSpecKey.Length]: ['mm'],
  [ProductSpecKey.Width]: ['mm'],
  [ProductSpecKey.Height]: ['mm'],
  [ProductSpecKey.Weight]: ['kg'],
  [ProductSpecKey.Tdp]: ['W'],
  [ProductSpecKey.SuggestedPsu]: ['W'],
  [ProductSpecKey.ClockSpeedBase]: ['MHz', 'GHz'],
  [ProductSpecKey.ClockSpeedBoost]: ['MHz', 'GHz'],
  [ProductSpecKey.L1Cache]: ['KB', 'MB'],
  [ProductSpecKey.L2Cache]: ['MB', 'KB'],
  [ProductSpecKey.PixelFillRate]: ['GPixel/s'],
  [ProductSpecKey.TextureRate]: ['GTexel/s'],
  [ProductSpecKey.Fp32Performance]: ['TFLOPS', 'GFLOPS'],
  [ProductSpecKey.Fp64Performance]: ['GFLOPS', 'TFLOPS'],
  [ProductSpecKey.MemorySize]: ['GB', 'MB', 'KB'],
  [ProductSpecKey.MaxMemorySize]: ['GB', 'MB', 'KB'],
  [ProductSpecKey.MemoryInterface]: ['bit'],
  [ProductSpecKey.MemoryBandwidth]: ['GB/s', 'MB/s'],
  [ProductSpecKey.MaxMemoryBandwidth]: ['GB/s', 'MB/s'],
};

interface ProductPropertyFieldProps {
  type?: string;
  propertyType: ProductPropertyType;
  field: ProductMetaKey | ProductSpecKey;

  value?: string | number;
  onChange?: (value: string | number) => void;

  autocomplete?: boolean;

  ref?: unknown;
}

export const ProductPropertyField: FunctionComponent<
  ProductPropertyFieldProps
> = (props) => {
  const { propertyType, field, autocomplete, value, onChange, ...restProps } =
    props;

  const { baseValue, suffixValue } = useMemo(
    () => parsePropertyValue(value),
    [value],
  );
  const suffixes = useMemo(() => SUFFIXES[field] ?? [], [field]);
  const [suffixIndex, setSuffixIndex] = useState(() =>
    suffixes.length > 0 && suffixValue != null
      ? suffixes.indexOf(suffixValue)
      : 0,
  );
  const suffix = useMemo(
    () => suffixes?.[suffixIndex],
    [suffixes, suffixIndex],
  );

  const handleAutocompleteChange = useCallback(
    (value: AutocompleteValue) => {
      const newValue = suffix != null ? `${value} ${suffix}` : value;
      onChange(newValue);
    },
    [suffix, onChange],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onChange(getPropertyValue(value, suffix));
    },
    [suffix, onChange],
  );

  const handleSuffixClick = useCallback(() => {
    const newIndex = suffixIndex < suffixes.length - 1 ? suffixIndex + 1 : 0;
    onChange(getPropertyValue(baseValue, suffixes[newIndex]));
    setSuffixIndex(newIndex);
  }, [baseValue, suffixes, suffixIndex, onChange]);

  if (autocomplete) {
    return (
      <ProductPropertyAutocomplete
        propertyType={propertyType}
        field={field}
        value={baseValue}
        onChange={handleAutocompleteChange}
        {...restProps}
      />
    );
  } else {
    return (
      <Input
        value={baseValue}
        suffix={suffixes.length > 0 ? suffixes[suffixIndex] : undefined}
        onChange={handleInputChange}
        onSuffixClick={handleSuffixClick}
        {...restProps}
      />
    );
  }
};

function getPropertyValue(base: string | number, suffix?: string) {
  return suffix != null ? `${base} ${suffix}` : base;
}

function parsePropertyValue(value?: string | number): ParsedValue {
  if (value == null) {
    return { baseValue: '' };
  } else if (typeof value === 'number') {
    return { baseValue: value };
  }

  const suffixIndex = value.lastIndexOf(' ');
  const baseValue =
    suffixIndex >= 0 ? value.substring(0, suffixIndex) : undefined;
  const suffixValue =
    suffixIndex >= 0 ? value.substring(suffixIndex + 1) : undefined;

  return { baseValue, suffixValue };
}
