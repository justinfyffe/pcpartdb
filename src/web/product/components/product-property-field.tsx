import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { ProductPropertyType } from '../../../types/product';
import { ProductMetaKey } from '../../../types/product-meta';
import { ProductSpecKey } from '../../../types/product-spec';
import {
  DateInput,
  NumberInput,
  TextInput,
} from '../../shared/components/input';
import { ProductPropertyAutocomplete } from './product-property-autocomplete';

type InputType = 'autocomplete' | 'text' | 'number' | 'date';

interface ParsedValue {
  baseValue: string;
  suffixValue?: string;
}

const SUFFIXES: { [key: string]: string[] } = {
  [ProductSpecKey.LaunchPrice]: ['USD'],
  [ProductSpecKey.Lithography]: ['nm', 'μm'],
  [ProductSpecKey.Transistors]: ['million'],
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

const INPUT_TYPES: { [key: string]: InputType } = {
  [ProductSpecKey.Architecture]: 'autocomplete',
  [ProductSpecKey.BusInterface]: 'autocomplete',
  [ProductSpecKey.ClockSpeedBase]: 'number',
  [ProductSpecKey.ClockSpeedBoost]: 'number',
  [ProductSpecKey.Company]: 'autocomplete',
  [ProductSpecKey.CudaCores]: 'number',
  [ProductSpecKey.DieSize]: 'number',
  [ProductSpecKey.DirectXVersion]: 'number',
  [ProductSpecKey.DisplayPorts]: 'autocomplete',
  [ProductSpecKey.Foundry]: 'autocomplete',
  [ProductSpecKey.Fp32Performance]: 'number',
  [ProductSpecKey.Fp64Performance]: 'number',
  [ProductSpecKey.Generation]: 'autocomplete',
  [ProductSpecKey.GpuName]: 'autocomplete',
  [ProductSpecKey.GpuVariant]: 'autocomplete',
  [ProductSpecKey.HdmiPorts]: 'autocomplete',
  [ProductSpecKey.Height]: 'number',
  [ProductSpecKey.L1Cache]: 'number',
  [ProductSpecKey.L2Cache]: 'number',
  [ProductSpecKey.LaunchPrice]: 'number',
  [ProductSpecKey.Length]: 'number',
  [ProductSpecKey.Lithography]: 'number',
  [ProductSpecKey.MaxMemoryBandwidth]: 'number',
  [ProductSpecKey.MaxMemorySize]: 'number',
  [ProductSpecKey.MaxResolution]: 'autocomplete',
  [ProductSpecKey.MemoryBandwidth]: 'number',
  [ProductSpecKey.MemoryInterface]: 'number',
  [ProductSpecKey.MemorySize]: 'number',
  [ProductSpecKey.MemoryType]: 'autocomplete',
  [ProductSpecKey.OpenClVersion]: 'number',
  [ProductSpecKey.OpenGlVersion]: 'number',
  [ProductSpecKey.PixelFillRate]: 'number',
  [ProductSpecKey.PowerConnectors]: 'autocomplete',
  [ProductSpecKey.ReleaseDate]: 'date',
  [ProductSpecKey.Rops]: 'number',
  [ProductSpecKey.RtCores]: 'number',
  [ProductSpecKey.ShaderModelVersion]: 'number',
  [ProductSpecKey.SlotWidth]: 'autocomplete',
  [ProductSpecKey.SuggestedPsu]: 'number',
  [ProductSpecKey.Tdp]: 'number',
  [ProductSpecKey.TensorCores]: 'number',
  [ProductSpecKey.TextureRate]: 'number',
  [ProductSpecKey.Tmus]: 'number',
  [ProductSpecKey.Transistors]: 'number',
  [ProductSpecKey.Weight]: 'number',
  [ProductSpecKey.Width]: 'number',
};

interface ProductPropertyFieldProps {
  type?: InputType;
  propertyType: ProductPropertyType;
  field: ProductMetaKey | ProductSpecKey;

  value?: string;
  onChange?: (value: string) => void;
}

export const ProductPropertyField = forwardRef<
  HTMLInputElement,
  ProductPropertyFieldProps
>((props, ref) => {
  const { type, propertyType, field, value, onChange } = props;

  const { baseValue, suffixValue } = useMemo(
    () => parsePropertyValue(field, value),
    [field, value],
  );
  const suffixes = useMemo(() => SUFFIXES[field] ?? [], [field]);

  const [suffixIndex, setSuffixIndex] = useState(() =>
    suffixes.length > 0 && suffixValue != null
      ? suffixes.indexOf(suffixValue)
      : 0,
  );

  const inputType = type ?? INPUT_TYPES[field];
  const suffix = suffixes?.[suffixIndex];

  const handleAutocompleteChange = useCallback(
    (value: string) => {
      onChange?.(getPropertyValue(value, suffix));
    },
    [suffix, onChange],
  );

  const handleNumberChange = useCallback(
    (value: number) => {
      onChange?.(getPropertyValue(`${value}`, suffix));
    },
    [suffix, onChange],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      onChange?.(getPropertyValue(value, suffix));
    },
    [suffix, onChange],
  );

  const handleSuffixClick = useCallback(() => {
    const newIndex = suffixIndex < suffixes.length - 1 ? suffixIndex + 1 : 0;
    setSuffixIndex(newIndex);

    onChange?.(getPropertyValue(baseValue, suffixes[newIndex]));
  }, [baseValue, suffixes, suffixIndex, onChange]);

  if (inputType === 'autocomplete') {
    return (
      <ProductPropertyAutocomplete
        propertyType={propertyType}
        field={field}
        value={baseValue}
        onChange={handleAutocompleteChange}
        ref={ref}
      />
    );
  } else if (inputType === 'date') {
    return (
      <DateInput
        value={baseValue}
        suffix={suffixes.length > 0 ? suffixes[suffixIndex] : undefined}
        onChange={handleInputChange}
        onSuffixClick={handleSuffixClick}
        ref={ref}
      />
    );
  } else if (inputType === 'number') {
    return (
      <NumberInput
        value={Number(baseValue)}
        suffix={suffixes.length > 0 ? suffixes[suffixIndex] : undefined}
        onChange={handleNumberChange}
        onSuffixClick={handleSuffixClick}
        ref={ref}
      />
    );
  } else {
    return (
      <TextInput
        value={baseValue}
        suffix={suffixes.length > 0 ? suffixes[suffixIndex] : undefined}
        onChange={handleInputChange}
        onSuffixClick={handleSuffixClick}
        ref={ref}
      />
    );
  }
});
ProductPropertyField.displayName = 'ProductPropertyField';

function getPropertyValue(base: string, suffix?: string) {
  if (base == null) {
    return null;
  }

  return suffix != null ? `${base} ${suffix}` : base;
}

function parsePropertyValue(
  field: ProductMetaKey | ProductSpecKey,
  value?: string,
): ParsedValue {
  if (value == null) {
    return { baseValue: null };
  }

  let baseValue = value;
  let suffixValue: string | undefined = undefined;

  if (SUFFIXES[field]) {
    // Guess the base value and suffix
    const suffixIndex = value.lastIndexOf(' ');
    const possibleSuffix =
      suffixIndex >= 0 ? value.substring(suffixIndex + 1) : undefined;

    // Check if the predicted suffix is a valid suffix
    if (suffixIndex >= 0 && SUFFIXES[field].includes(possibleSuffix)) {
      baseValue = value.substring(0, suffixIndex);
      suffixValue = possibleSuffix;
    }
  }

  return { baseValue, suffixValue };
}
