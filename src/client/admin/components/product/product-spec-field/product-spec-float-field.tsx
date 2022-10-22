import { NumberInput } from '@client/shared/components';
import { ProductSpecKey, ProductSpecRequest } from '@shared/product-spec';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const SUFFIXES: { [key: string]: string[] } = {
  [ProductSpecKey.LaunchPriceMsrp]: ['USD'],
  [ProductSpecKey.ProcessSize]: ['nm', 'μm'],
  [ProductSpecKey.Transistors]: ['million'],
  [ProductSpecKey.Length]: ['mm'],
  [ProductSpecKey.Width]: ['mm'],
  [ProductSpecKey.Height]: ['mm'],
  [ProductSpecKey.Weight]: ['kg'],
  [ProductSpecKey.Tdp]: ['W'],
  [ProductSpecKey.SuggestedPsu]: ['W'],
  [ProductSpecKey.CoreClockSpeedBase]: ['MHz', 'GHz'],
  [ProductSpecKey.CoreClockSpeedBoost]: ['MHz', 'GHz'],
  [ProductSpecKey.L1Cache]: ['KB', 'MB'],
  [ProductSpecKey.L2Cache]: ['MB', 'KB'],
  [ProductSpecKey.PixelFillRate]: ['GPixel/s'],
  [ProductSpecKey.TextureFillRate]: ['GTexel/s'],
  [ProductSpecKey.Fp32Performance]: ['TFLOPS', 'GFLOPS'],
  [ProductSpecKey.Fp64Performance]: ['GFLOPS', 'TFLOPS'],
  [ProductSpecKey.MemorySize]: ['GB', 'MB', 'KB'],
  [ProductSpecKey.MemoryInterface]: ['bit'],
  [ProductSpecKey.MemoryBandwidth]: ['GB/s', 'MB/s'],
  [ProductSpecKey.MemoryClock]: ['MHz'],
};

interface ProductSpecFloatFieldProps {
  field: ProductSpecKey;

  value?: ProductSpecRequest;
  onChange?: (value: ProductSpecRequest) => void;
}

export const ProductSpecFloatField = forwardRef<
  HTMLInputElement,
  ProductSpecFloatFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const suffixes = useMemo(() => SUFFIXES[field] ?? [], [field]);

  const baseValue = value?.floatValue ?? null;
  const suffix = value?.metadata?.suffix ?? suffixes[0] ?? null;

  const [suffixIndex, setSuffixIndex] = useState(() =>
    suffixes.length > 0 && suffix != null ? suffixes.indexOf(suffix) : 0,
  );

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(
        value != null
          ? { key: field, floatValue: value, metadata: { suffix } }
          : null,
      );
    },
    [field, suffix, onChange],
  );

  const handleSuffixClick = useCallback(() => {
    const newIndex = suffixIndex < suffixes.length - 1 ? suffixIndex + 1 : 0;
    setSuffixIndex(newIndex);
    const newValue: ProductSpecRequest = {
      key: field,
      floatValue: baseValue,
      metadata: { suffix: suffixes[suffixIndex] },
    };

    onChange?.(newValue);
  }, [field, baseValue, suffixes, suffixIndex, onChange]);

  return (
    <NumberInput
      value={baseValue}
      suffix={suffix}
      onChange={handleChange}
      onSuffixClick={handleSuffixClick}
      ref={ref}
    />
  );
});
ProductSpecFloatField.displayName = 'ProductSpecFloatField';
