import { NumberInput } from '@client/shared/components';
import { Spec, Specs } from '@shared/spec';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const PREFIXES: { [key: string]: string[] } = {
  launchPrice: ['$'],
};

const SUFFIXES: Record<string, string[]> = {
  processSize: ['nm', 'μm'],
  transistors: ['million'],
  length: ['mm'],
  width: ['mm'],
  height: ['mm'],
  weight: ['kg'],
  thermalDesignPower: ['W'],
  suggestedPsu: ['W'],
  coreClockSpeedBase: ['MHz', 'GHz'],
  coreClockSpeedBoost: ['MHz', 'GHz'],
  l1Cache: ['KB', 'MB'],
  l2Cache: ['MB', 'KB'],
  pixelFillRate: ['GPixel/s'],
  textureFillRate: ['GTexel/s'],
  fp32Performance: ['TFLOPS', 'GFLOPS'],
  fp64Performance: ['GFLOPS', 'TFLOPS'],
  memorySize: ['GB', 'MB', 'KB'],
  memoryInterface: ['bit'],
  memoryBandwidth: ['GB/s', 'MB/s'],
  memoryClock: ['MHz'],
};

interface SpecFloatFieldProps {
  field: keyof Specs;

  value?: Spec<number>;
  onChange?: (value: Spec<number>) => void;
}

export const SpecFloatField = forwardRef<HTMLInputElement, SpecFloatFieldProps>(
  (props, ref) => {
    const { field, value, onChange } = props;

    const prefixes = useMemo(() => PREFIXES[field] ?? [], [field]);
    const suffixes = useMemo(() => SUFFIXES[field] ?? [], [field]);
    const prefix = useMemo(() => {
      return prefixes.includes(value?.metadata?.prefix)
        ? value?.metadata?.prefix
        : prefixes[0] ?? null;
    }, [prefixes, value]);

    const suffix = useMemo(() => {
      return suffixes.includes(value?.metadata?.suffix)
        ? value?.metadata?.suffix
        : suffixes[0] ?? null;
    }, [suffixes, value]);

    const [prefixIndex, setPrefixIndex] = useState(() =>
      prefixes.length > 0 && prefix != null ? prefixes.indexOf(prefix) : 0,
    );
    const [suffixIndex, setSuffixIndex] = useState(() =>
      suffixes.length > 0 && suffix != null ? suffixes.indexOf(suffix) : 0,
    );

    const baseValue = value?.value ?? null;

    const handleChange = useCallback(
      (value: number) => {
        onChange?.(
          value != null ? { value, metadata: { prefix, suffix } } : null,
        );
      },
      [prefix, suffix, onChange],
    );

    const handlePrefixClick = useCallback(() => {
      const newIndex = prefixIndex < prefixes.length - 1 ? prefixIndex + 1 : 0;
      setPrefixIndex(newIndex);
      const newValue: Spec<number> = {
        value: baseValue,
        metadata: { prefix: prefixes[prefixIndex] },
      };

      onChange?.(newValue);
    }, [baseValue, prefixes, prefixIndex, onChange]);

    const handleSuffixClick = useCallback(() => {
      const newIndex = suffixIndex < suffixes.length - 1 ? suffixIndex + 1 : 0;
      setSuffixIndex(newIndex);
      const newValue: Spec<number> = {
        value: baseValue,
        metadata: { suffix: suffixes[suffixIndex] },
      };

      onChange?.(newValue);
    }, [baseValue, suffixes, suffixIndex, onChange]);

    return (
      <NumberInput
        value={baseValue}
        prefix={prefix}
        suffix={suffix}
        onChange={handleChange}
        onPrefixClick={handlePrefixClick}
        onSuffixClick={handleSuffixClick}
        ref={ref}
      />
    );
  },
);
SpecFloatField.displayName = 'SpecFloatField';
