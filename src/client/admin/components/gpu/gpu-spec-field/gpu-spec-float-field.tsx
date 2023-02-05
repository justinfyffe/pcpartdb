import { NumberInput } from '@client/shared/components';
import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuSpecValue,
  calculateDisplayGpuSpecValue,
  ClockSpeedUnit,
  CurrencyUnit,
  FlopsUnit,
  getUnitFormat,
  GpuSpec,
  GpuSpecKey,
  GpuUnit,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from '@shared/gpus';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const UNITS: Record<string, GpuUnit[]> = {
  launchPrice: [CurrencyUnit.USD],
  processSize: [LengthUnit.nm, LengthUnit.um],
  transistors: [NumericUnit.million],
  length: [LengthUnit.mm],
  width: [LengthUnit.mm],
  height: [LengthUnit.mm],
  weight: [WeightUnit.kg],
  thermalDesignPower: [WattageUnit.w],
  suggestedPsu: [WattageUnit.w],
  coreClockSpeedBase: [ClockSpeedUnit.mhz, ClockSpeedUnit.ghz],
  coreClockSpeedBoost: [ClockSpeedUnit.mhz, ClockSpeedUnit.ghz],
  l1Cache: [MemoryUnit.kb, MemoryUnit.mb],
  l2Cache: [MemoryUnit.mb, MemoryUnit.kb],
  pixelFillRate: [PixelFillRateUnit.gpixelps],
  textureFillRate: [TextureFillRateUnit.gtexelps],
  fp32Performance: [FlopsUnit.tflops, FlopsUnit.gflops],
  fp64Performance: [FlopsUnit.gflops, FlopsUnit.tflops],
  memorySize: [MemoryUnit.gb, MemoryUnit.mb, MemoryUnit.kb],
  memoryInterface: [BitUnit.bit],
  memoryBandwidth: [BandwidthUnit.gbps, BandwidthUnit.mbps],
  memoryClock: [ClockSpeedUnit.mhz],
};

interface GpuSpecFloatFieldProps {
  field: GpuSpecKey;

  value?: GpuSpec<number>;
  onChange?: (value: GpuSpec<number>) => void;
}

export const GpuSpecFloatField = forwardRef<
  HTMLInputElement,
  GpuSpecFloatFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const units = useMemo(() => UNITS[field] ?? [], [field]);
  const unit = useMemo(() => {
    return units.includes(value?.meta?.unit)
      ? value?.meta?.unit
      : units[0] ?? null;
  }, [units, value]);

  const [unitIndex, setUnitIndex] = useState(() =>
    units.length > 0 && unit != null ? units.indexOf(unit) : 0,
  );

  const displayValue = useMemo(() => {
    if (value?.value == null) {
      return null;
    }

    return calculateDisplayGpuSpecValue(value.value, unit);
  }, [value, unit]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(
        value != null
          ? {
              value: calculateBaseGpuSpecValue(value, unit),
              meta: { specKey: field, unit: unit },
            }
          : null,
      );
    },
    [field, unit, onChange],
  );

  const handleUnitClick = useCallback(() => {
    const newIndex = unitIndex < units.length - 1 ? unitIndex + 1 : 0;
    setUnitIndex(newIndex);
    const newValue: GpuSpec<number> = {
      value: calculateBaseGpuSpecValue(displayValue, units[unitIndex]),
      meta: { specKey: field, unit: units[unitIndex] },
    };

    onChange?.(newValue);
  }, [unitIndex, units, displayValue, field, onChange]);

  return (
    <NumberInput
      value={displayValue}
      suffix={getUnitFormat(unit)}
      onChange={handleChange}
      onSuffixClick={handleUnitClick}
      ref={ref}
    />
  );
});
GpuSpecFloatField.displayName = 'GpuSpecFloatField';
