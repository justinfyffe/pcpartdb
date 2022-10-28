import { SpecKey, SpecRequest } from '@shared/spec';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SpecAutocompleteField } from './spec-autocomplete-field';
import { SpecBooleanField } from './spec-boolean-field';
import { SpecDateField } from './spec-date-field';
import { SpecEnumField } from './spec-enum-field';
import { SpecFloatField } from './spec-float-field';
import { SpecStringField } from './spec-string-field';
import { SpecTextField } from './spec-text-field';

type InputType =
  | 'autocomplete'
  | 'string'
  | 'text'
  | 'float'
  | 'date'
  | 'boolean'
  | 'enum';

const INPUT_TYPES: { [key: string]: InputType } = {
  // General
  [SpecKey.Company]: 'autocomplete',
  [SpecKey.MarketSegment]: 'enum',
  [SpecKey.LaunchPriceMsrp]: 'float',
  [SpecKey.ReleaseDate]: 'date',

  // Processor
  [SpecKey.GpuName]: 'autocomplete',
  [SpecKey.Architecture]: 'autocomplete',
  [SpecKey.ProcessSize]: 'float',
  [SpecKey.Transistors]: 'float',

  // Memory
  [SpecKey.MemorySize]: 'float',
  [SpecKey.MemoryType]: 'autocomplete',
  [SpecKey.MemoryClock]: 'float',
  [SpecKey.MemoryInterface]: 'float',
  [SpecKey.MemoryBandwidth]: 'float',

  // Board Design
  [SpecKey.SlotWidth]: 'autocomplete',
  [SpecKey.Length]: 'float',
  [SpecKey.Width]: 'float',
  [SpecKey.Height]: 'float',
  [SpecKey.Weight]: 'float',
  [SpecKey.SuggestedPsu]: 'float',
  [SpecKey.ThermalDesignPower]: 'float',
  [SpecKey.BusInterface]: 'autocomplete',
  [SpecKey.PowerConnectors]: 'autocomplete',
  [SpecKey.Outputs]: 'autocomplete',

  // Cores & Clock Speeds
  [SpecKey.ShaderUnitsCudaCores]: 'float',
  [SpecKey.TextureMappingUnits]: 'float',
  [SpecKey.RenderOutputUnits]: 'float',
  [SpecKey.TensorCores]: 'float',
  [SpecKey.RayTracingCores]: 'float',
  [SpecKey.CoreClockSpeedBase]: 'float',
  [SpecKey.CoreClockSpeedBoost]: 'float',
  [SpecKey.L1Cache]: 'float',
  [SpecKey.L2Cache]: 'float',

  // Theoretical Performance
  [SpecKey.PixelFillRate]: 'float',
  [SpecKey.TextureFillRate]: 'float',
  [SpecKey.Fp32Performance]: 'float',
  [SpecKey.Fp64Performance]: 'float',

  // API Support
  [SpecKey.DirectXVersion]: 'float',
  [SpecKey.OpenClVersion]: 'float',
  [SpecKey.OpenGlVersion]: 'float',
  [SpecKey.ShaderModelVersion]: 'float',
  [SpecKey.GSyncFreeSyncSupport]: 'boolean',
  [SpecKey.SliCrossfireSupport]: 'boolean',
};

interface SpecFieldProps {
  type?: InputType;
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecField = forwardRef<unknown, SpecFieldProps>((props, ref) => {
  const { type, field, value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleChange = useCallback(
    (value: SpecRequest) => {
      setValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  const inputType = type ?? INPUT_TYPES[field];
  if (inputType === 'autocomplete') {
    return (
      <SpecAutocompleteField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'string') {
    return (
      <SpecStringField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'text') {
    return (
      <SpecTextField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLTextAreaElement>}
      />
    );
  } else if (inputType === 'float') {
    return (
      <SpecFloatField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'date') {
    return (
      <SpecDateField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'boolean') {
    return (
      <SpecBooleanField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLSelectElement>}
      />
    );
  } else if (inputType === 'enum') {
    return (
      <SpecEnumField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLSelectElement>}
      />
    );
  } else {
    return (
      <SpecStringField
        field={field}
        value={value}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  }
});
SpecField.displayName = 'SpecField';
