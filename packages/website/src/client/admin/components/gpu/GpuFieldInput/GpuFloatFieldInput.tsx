import {
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  CurrencyUnit,
  FlopsUnit,
  formatGpuField,
  getBaseUnitValue,
  getDisplayUnitValue,
  getUnitFormat,
  GpuField,
  GpuFieldKey,
  hasProductFieldValue,
  LengthUnit,
  MeasurementUnit,
  MemorySizeUnit,
  NumericUnit,
  PixelFillRateUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const UNITS: Record<string, MeasurementUnit[]> = {
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
  l1Cache: [MemorySizeUnit.kb, MemorySizeUnit.mb],
  l2Cache: [MemorySizeUnit.mb, MemorySizeUnit.kb],
  pixelFillRate: [PixelFillRateUnit.gpixelps],
  textureFillRate: [TextureFillRateUnit.gtexelps],
  fp32Performance: [FlopsUnit.tflops, FlopsUnit.gflops],
  fp64Performance: [FlopsUnit.gflops, FlopsUnit.tflops],
  memorySize: [MemorySizeUnit.gb, MemorySizeUnit.mb, MemorySizeUnit.kb],
  memoryInterface: [BitUnit.bit],
  memoryBandwidth: [BandwidthUnit.gbps, BandwidthUnit.mbps],
  memoryClock: [ClockSpeedUnit.mhz],
};

interface GpuFloatFieldInputProps {
  field: GpuFieldKey;

  value?: GpuField<number>;
  parentValue?: GpuField<number>;
  onChange?: (value: GpuField<number>) => void;
}

export const GpuFloatFieldInput = forwardRef<
  HTMLInputElement,
  GpuFloatFieldInputProps
>((props, ref) => {
  const { field, value, parentValue, onChange } = props;

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
    if (!hasProductFieldValue(value)) {
      return null;
    }

    return getDisplayUnitValue(value.value, unit);
  }, [value, unit]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.({
        value: getBaseUnitValue(value, unit),
        meta: { fieldKey: field, unit: unit },
      });
    },
    [field, unit, onChange],
  );

  const handleUnitClick = useCallback(() => {
    const newIndex = unitIndex < units.length - 1 ? unitIndex + 1 : 0;
    setUnitIndex(newIndex);
    const newValue: GpuField<number> = {
      value: getBaseUnitValue(displayValue, units[unitIndex]),
      meta: { fieldKey: field, unit: units[unitIndex] },
    };

    onChange?.(newValue);
  }, [unitIndex, units, displayValue, field, onChange]);

  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  return (
    <NumberInput
      placeholder={placeholder}
      disabled={value?.meta?.autoUpdate}
      value={displayValue}
      suffix={getUnitFormat(unit)}
      onChange={handleChange}
      onSuffixClick={handleUnitClick}
      ref={ref}
    />
  );
});
GpuFloatFieldInput.displayName = 'GpuFloatFieldInput';
