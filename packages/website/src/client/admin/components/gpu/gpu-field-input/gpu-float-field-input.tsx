import {
  BandwidthUnit,
  BitUnit,
  calculateBaseGpuFieldValue,
  calculateDisplayGpuFieldValue,
  ClockSpeedUnit,
  CurrencyUnit,
  FlopsUnit,
  getUnitFormat,
  GpuField,
  GpuFieldUnit,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from '@pcpartdb/shared/gpus';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { NumberInput } from '../../../../shared/components';

const UNITS: Record<string, GpuFieldUnit[]> = {
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

interface GpuFloatFieldInputProps {
  field: string;

  value?: GpuField<number>;
  onChange?: (value: GpuField<number>) => void;
}

export const GpuFloatFieldInput = forwardRef<
  HTMLInputElement,
  GpuFloatFieldInputProps
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

    return calculateDisplayGpuFieldValue(value.value, unit);
  }, [value, unit]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(
        value != null
          ? {
              value: calculateBaseGpuFieldValue(value, unit),
              meta: { fieldKey: field, unit: unit },
            }
          : null,
      );
    },
    [field, unit, onChange],
  );

  const handleUnitClick = useCallback(() => {
    const newIndex = unitIndex < units.length - 1 ? unitIndex + 1 : 0;
    setUnitIndex(newIndex);
    const newValue: GpuField<number> = {
      value: calculateBaseGpuFieldValue(displayValue, units[unitIndex]),
      meta: { fieldKey: field, unit: units[unitIndex] },
    };

    onChange?.(newValue);
  }, [unitIndex, units, displayValue, field, onChange]);

  return (
    <NumberInput
      disabled={value?.meta?.dataSource?.enabled}
      value={displayValue}
      suffix={getUnitFormat(unit)}
      onChange={handleChange}
      onSuffixClick={handleUnitClick}
      ref={ref}
    />
  );
});
GpuFloatFieldInput.displayName = 'GpuFloatFieldInput';
