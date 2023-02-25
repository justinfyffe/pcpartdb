import { GpuField } from '@shared/gpus';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GpuAutocompleteSpecFieldInput } from './gpu-autocomplete-spec-field-input';
import { GpuBooleanFieldInput } from './gpu-boolean-field-input';
import { GpuCurrencyFieldInput } from './gpu-currency-field-input';
import { GpuDateFieldInput } from './gpu-date-field-input';
import { GpuEnumFieldInput } from './gpu-enum-field-input';
import { GpuFloatFieldInput } from './gpu-float-field-input';
import { GpuStringFieldInput } from './gpu-string-field-input';
import { GpuTextFieldInput } from './gpu-text-field-input';

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
  computeUnitsSmCount: 'float',
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
  openClVersion: 'autocomplete',
  openGlVersion: 'autocomplete',
  shaderModelVersion: 'autocomplete',
};

interface GpuSpecFieldProps {
  type?: InputType;
  field: string;

  value?: GpuField;
  onChange?: (value: GpuField) => void;
}

export const GpuFieldInput = forwardRef<unknown, GpuSpecFieldProps>(
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
        <GpuAutocompleteSpecFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'currency') {
      return (
        <GpuCurrencyFieldInput
          field={field}
          value={value as GpuField<number>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <GpuStringFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'text') {
      return (
        <GpuTextFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      );
    } else if (inputType === 'float') {
      return (
        <GpuFloatFieldInput
          field={field}
          value={value as GpuField<number>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'date') {
      return (
        <GpuDateFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else if (inputType === 'boolean') {
      return (
        <GpuBooleanFieldInput
          field={field}
          value={value as GpuField<boolean>}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else if (inputType === 'enum') {
      return (
        <GpuEnumFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLSelectElement>}
        />
      );
    } else {
      return (
        <GpuStringFieldInput
          field={field}
          value={value as GpuField<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
GpuFieldInput.displayName = 'GpuFieldInput';
