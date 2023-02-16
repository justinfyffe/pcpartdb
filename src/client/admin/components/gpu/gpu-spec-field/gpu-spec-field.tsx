import { GpuField } from '@shared/gpus';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GpuSpecAutocompleteField } from './gpu-spec-autocomplete-field';
import { GpuSpecBooleanField } from './gpu-spec-boolean-field';
import { GpuSpecCurrencyField } from './gpu-spec-currency-field';
import { GpuSpecDateField } from './gpu-spec-date-field';
import { GpuSpecEnumField } from './gpu-spec-enum-field';
import { GpuSpecFloatField } from './gpu-spec-float-field';
import { GpuSpecStringField } from './gpu-spec-string-field';
import { GpuSpecTextField } from './gpu-spec-text-field';

type InputType =
  | 'autocomplete'
  | 'currency'
  | 'string'
  | 'text'
  | 'float'
  | 'date'
  | 'boolean'
  | 'enum';

const INPUT_TYPES: Record<string, InputType> = {
  // General
  company: 'string',
  marketSegment: 'enum',
  launchPrice: 'currency',
  releaseDate: 'date',

  // Processor
  codename: 'autocomplete',
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
  directxVersion: 'autocomplete',
  openClVersion: 'float',
  openGlVersion: 'float',
  shaderModelVersion: 'float',
};

interface GpuSpecFieldProps {
  type?: InputType;
  field: string;

  value?: GpuField;
  onChange?: (value: GpuField) => void;
}

export const GpuSpecField = forwardRef<unknown, GpuSpecFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue || null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: GpuField) => {
        setValue(value);
        onChange?.(value);
      },
      [onChange],
    );

    const inputType = type ?? INPUT_TYPES[field];
    if (inputType === 'autocomplete') {
      return (
        <GpuSpecAutocompleteField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'currency') {
      return (
        <GpuSpecCurrencyField
          field={field}
          value={value as GpuField<number>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <GpuSpecStringField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'text') {
      return (
        <GpuSpecTextField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      );
    } else if (inputType === 'float') {
      return (
        <GpuSpecFloatField
          field={field}
          value={value as GpuField<number>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'date') {
      return (
        <GpuSpecDateField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'boolean') {
      return (
        <GpuSpecBooleanField
          field={field}
          value={value as GpuField<boolean>}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else if (inputType === 'enum') {
      return (
        <GpuSpecEnumField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else {
      return (
        <GpuSpecStringField
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
GpuSpecField.displayName = 'GpuSpecField';
