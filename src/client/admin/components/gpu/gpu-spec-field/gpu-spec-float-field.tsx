import { NumberInput } from '@client/shared/components';
import {
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  FlopsUnit,
  getBaseGpuSpecValue,
  getDisplayGpuSpecValue,
  GpuSpec,
  GpuSpecKey,
  GpuSpecUnit,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from '@shared/gpus';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

const DISPLAY_UNITS: Record<string, GpuSpecUnit[]> = {
  processSize: [LengthUnit.nm, LengthUnit.um],
  transistors: [NumericUnit.million],
  length: [LengthUnit.mm],
  width: [LengthUnit.mm],
  height: [LengthUnit.mm],
  weight: [WeightUnit.kg],
  thermalDesignPower: [WattageUnit.W],
  suggestedPsu: [WattageUnit.W],
  coreClockSpeedBase: [ClockSpeedUnit.MHz, ClockSpeedUnit.GHz],
  coreClockSpeedBoost: [ClockSpeedUnit.MHz, ClockSpeedUnit.GHz],
  l1Cache: [MemoryUnit.KB, MemoryUnit.MB],
  l2Cache: [MemoryUnit.MB, MemoryUnit.KB],
  pixelFillRate: [PixelFillRateUnit.GPixelps],
  textureFillRate: [TextureFillRateUnit.GTexelps],
  fp32Performance: [FlopsUnit.TFLOPS, FlopsUnit.GFLOPS],
  fp64Performance: [FlopsUnit.GFLOPS, FlopsUnit.TFLOPS],
  memorySize: [MemoryUnit.GB, MemoryUnit.MB, MemoryUnit.KB],
  memoryInterface: [BitUnit.bit],
  memoryBandwidth: [BandwidthUnit.Gbps, BandwidthUnit.Mbps],
  memoryClock: [ClockSpeedUnit.MHz],
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

  const displayUnits = useMemo(() => DISPLAY_UNITS[field] ?? [], [field]);
  const displayUnit = useMemo(() => {
    return displayUnits.includes(value?.meta?.displayUnit)
      ? value?.meta?.displayUnit
      : displayUnits[0] ?? null;
  }, [displayUnits, value]);

  const [unitIndex, setUnitIndex] = useState(() =>
    displayUnits.length > 0 && displayUnit != null
      ? displayUnits.indexOf(displayUnit)
      : 0,
  );

  const displayValue = useMemo(() => {
    if (value?.value == null) {
      return null;
    }

    return getDisplayGpuSpecValue(value.value, displayUnit);
  }, [value, displayUnit]);

  const handleChange = useCallback(
    (value: number) => {
      onChange?.(
        value != null
          ? {
              value: getBaseGpuSpecValue(value, displayUnit),
              meta: { specKey: field, displayUnit },
            }
          : null,
      );
    },
    [field, displayUnit, onChange],
  );

  const handleUnitClick = useCallback(() => {
    const newIndex = unitIndex < displayUnits.length - 1 ? unitIndex + 1 : 0;
    setUnitIndex(newIndex);
    const newValue: GpuSpec<number> = {
      value: getBaseGpuSpecValue(displayValue, displayUnits[unitIndex]),
      meta: { specKey: field, displayUnit: displayUnits[unitIndex] },
    };

    onChange?.(newValue);
  }, [unitIndex, displayUnits, displayValue, field, onChange]);

  return (
    <NumberInput
      value={displayValue}
      suffix={displayUnit}
      onChange={handleChange}
      onSuffixClick={handleUnitClick}
      ref={ref}
    />
  );
});
GpuSpecFloatField.displayName = 'GpuSpecFloatField';
