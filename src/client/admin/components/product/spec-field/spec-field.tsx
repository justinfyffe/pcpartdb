import { Spec, SpecKey } from '@shared/spec';
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

const INPUT_TYPES: Record<string, InputType> = {
  // General
  company: 'autocomplete',
  marketSegment: 'enum',
  launchPrice: 'float',
  releaseDate: 'date',

  // Processor
  gpuName: 'autocomplete',
  architecture: 'autocomplete',
  processSize: 'float',
  transistors: 'float',

  // Memory
  memorySize: 'float',
  memoryType: 'autocomplete',
  memoryClock: 'float',
  memoryInterface: 'float',
  memoryBandwidth: 'float',

  // Board Design
  slotWidth: 'float',
  length: 'float',
  width: 'float',
  height: 'float',
  weight: 'float',
  suggestedPsu: 'float',
  thermalDesignPower: 'float',
  busInterface: 'autocomplete',
  powerConnectors: 'autocomplete',
  outputs: 'autocomplete',

  // Cores & Clock Speeds
  shaderUnitsCudaCores: 'float',
  textureMappingUnits: 'float',
  renderOutputUnits: 'float',
  tensorCores: 'float',
  rayTracingCores: 'float',
  coreClockSpeedBase: 'float',
  coreClockSpeedBoost: 'float',
  l1Cache: 'float',
  l2Cache: 'float',

  // Theoretical Performance
  pixelFillRate: 'float',
  textureFillRate: 'float',
  fp32Performance: 'float',
  fp64Performance: 'float',

  // API Support
  directXVersion: 'float',
  openClVersion: 'float',
  openGlVersion: 'float',
  shaderModelVersion: 'float',
  gSyncFreeSyncSupport: 'boolean',
  sliCrossfireSupport: 'boolean',
};

interface SpecFieldProps {
  type?: InputType;
  field: SpecKey;

  value?: Spec;
  onChange?: (value: Spec) => void;
}

export const SpecField = forwardRef<unknown, SpecFieldProps>((props, ref) => {
  const { type, field, value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue || null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleChange = useCallback(
    (value: Spec) => {
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
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'string') {
    return (
      <SpecStringField
        field={field}
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'text') {
    return (
      <SpecTextField
        field={field}
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLTextAreaElement>}
      />
    );
  } else if (inputType === 'float') {
    return (
      <SpecFloatField
        field={field}
        value={value as Spec<number>}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'date') {
    return (
      <SpecDateField
        field={field}
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  } else if (inputType === 'boolean') {
    return (
      <SpecBooleanField
        field={field}
        value={value as Spec<boolean>}
        onChange={handleChange}
        ref={ref as Ref<HTMLSelectElement>}
      />
    );
  } else if (inputType === 'enum') {
    return (
      <SpecEnumField
        field={field}
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLSelectElement>}
      />
    );
  } else {
    return (
      <SpecStringField
        field={field}
        value={value as Spec<string>}
        onChange={handleChange}
        ref={ref as Ref<HTMLInputElement>}
      />
    );
  }
});
SpecField.displayName = 'SpecField';
