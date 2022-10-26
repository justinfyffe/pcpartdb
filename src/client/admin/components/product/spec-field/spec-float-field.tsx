import { NumberInput } from '@client/shared/components';
import { SpecKey, SpecRequest } from '@shared/spec';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const SUFFIXES: { [key: string]: string[] } = {
  [SpecKey.LaunchPriceMsrp]: ['USD'],
  [SpecKey.ProcessSize]: ['nm', 'μm'],
  [SpecKey.Transistors]: ['million'],
  [SpecKey.Length]: ['mm'],
  [SpecKey.Width]: ['mm'],
  [SpecKey.Height]: ['mm'],
  [SpecKey.Weight]: ['kg'],
  [SpecKey.ThermalDesignPower]: ['W'],
  [SpecKey.SuggestedPsu]: ['W'],
  [SpecKey.CoreClockSpeedBase]: ['MHz', 'GHz'],
  [SpecKey.CoreClockSpeedBoost]: ['MHz', 'GHz'],
  [SpecKey.L1Cache]: ['KB', 'MB'],
  [SpecKey.L2Cache]: ['MB', 'KB'],
  [SpecKey.PixelFillRate]: ['GPixel/s'],
  [SpecKey.TextureFillRate]: ['GTexel/s'],
  [SpecKey.Fp32Performance]: ['TFLOPS', 'GFLOPS'],
  [SpecKey.Fp64Performance]: ['GFLOPS', 'TFLOPS'],
  [SpecKey.MemorySize]: ['GB', 'MB', 'KB'],
  [SpecKey.MemoryInterface]: ['bit'],
  [SpecKey.MemoryBandwidth]: ['GB/s', 'MB/s'],
  [SpecKey.MemoryClock]: ['MHz'],
};

interface SpecFloatFieldProps {
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecFloatField = forwardRef<HTMLInputElement, SpecFloatFieldProps>(
  (props, ref) => {
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
      const newValue: SpecRequest = {
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
  },
);
SpecFloatField.displayName = 'SpecFloatField';
