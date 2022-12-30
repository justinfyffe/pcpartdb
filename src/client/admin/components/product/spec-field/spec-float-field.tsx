import { NumberInput } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const UNITS: Record<string, string[]> = {
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
  launchPrice: ['USD'],
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
  field: SpecKey;

  value?: Spec<number>;
  onChange?: (value: Spec<number>) => void;
}

export const SpecFloatField = forwardRef<HTMLInputElement, SpecFloatFieldProps>(
  (props, ref) => {
    const { field, value, onChange } = props;

    const units = useMemo(() => UNITS[field] ?? [], [field]);

    const unit = useMemo(() => {
      return units.includes(value?.metadata?.unit)
        ? value?.metadata?.unit
        : units[0] ?? null;
    }, [units, value]);

    const [unitIndex, setUnitIndex] = useState(() =>
      units.length > 0 && unit != null ? units.indexOf(unit) : 0,
    );

    const baseValue = value?.value ?? null;

    const handleChange = useCallback(
      (value: number) => {
        onChange?.(
          value != null
            ? { value, metadata: { specKey: field, unit: unit } }
            : null,
        );
      },
      [field, unit, onChange],
    );

    const handleUnitClick = useCallback(() => {
      const newIndex = unitIndex < units.length - 1 ? unitIndex + 1 : 0;
      setUnitIndex(newIndex);
      const newValue: Spec<number> = {
        value: baseValue,
        metadata: { specKey: field, unit: units[unitIndex] },
      };

      onChange?.(newValue);
    }, [baseValue, field, units, unitIndex, onChange]);

    return (
      <NumberInput
        value={baseValue}
        suffix={unit}
        onChange={handleChange}
        onSuffixClick={handleUnitClick}
        ref={ref}
      />
    );
  },
);
SpecFloatField.displayName = 'SpecFloatField';
