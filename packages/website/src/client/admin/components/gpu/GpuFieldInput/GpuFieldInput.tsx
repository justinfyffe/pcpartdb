import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Checkbox } from '../../../../shared/components';
import { GpuAutocompleteSpecFieldInput } from './GpuAutocompleteSpecFieldInput';
import { GpuBooleanFieldInput } from './GpuBooleanFieldInput';
import { GpuCurrencyFieldInput } from './GpuCurrencyFieldInput';
import { GpuDateFieldInput } from './GpuDateFieldInput';
import { GpuEnumFieldInput } from './GpuEnumFieldInput';
import { GpuFloatFieldInput } from './GpuFloatFieldInput';
import { GpuStringFieldInput } from './GpuStringFieldInput';
import { GpuTextFieldInput } from './GpuTextFieldInput';

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
  company: 'autocomplete',
  marketSegment: 'enum',
  launchPrice: 'currency',
  releaseDate: 'date',
  productionStatus: 'enum',

  // Processor
  partNumber: 'string',
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

interface GpuFieldInputProps {
  type?: InputType;
  field: GpuFieldKey;

  value?: GpuField;
  parentValue?: GpuField;
  onChange?: (value: GpuField) => void;
}

export const GpuFieldInput = forwardRef<unknown, GpuFieldInputProps>(
  (props, ref) => {
    const { type, field, value: propsValue, parentValue, onChange } = props;

    const [value, setValue] = useState(propsValue || null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: GpuField) => {
        if (value != null) {
          value.meta = { fieldKey: field, ...(value?.meta ?? {}) };
        }
        value.meta.autoUpdate = false;

        setValue(value);
        onChange?.(value);
      },
      [field, onChange],
    );

    const handleAutoUpdateChange = useCallback(
      (checked: boolean) => {
        const newValue = value || { value: null, meta: { fieldKey: field } };
        newValue.meta.autoUpdate = checked;

        setValue(newValue);
        onChange?.(newValue);
      },
      [field, onChange, value],
    );

    const inputType = type ?? INPUT_TYPES[field];
    const renderInput = useCallback(() => {
      if (inputType === 'autocomplete') {
        return (
          <GpuAutocompleteSpecFieldInput
            field={field}
            value={value as GpuField<string>}
            parentValue={parentValue as GpuField<string>}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'currency') {
        return (
          <GpuCurrencyFieldInput
            field={field}
            value={value as GpuField<number>}
            parentValue={parentValue as GpuField<number>}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'string') {
        return (
          <GpuStringFieldInput
            field={field}
            value={value as GpuField<string>}
            parentValue={parentValue as GpuField<string>}
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
            parentValue={parentValue as GpuField<number>}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'date') {
        return (
          <GpuDateFieldInput
            field={field}
            value={value as GpuField<string>}
            parentValue={parentValue as GpuField<string>}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      } else if (inputType === 'boolean') {
        return (
          <GpuBooleanFieldInput
            field={field}
            value={value as GpuField<boolean>}
            parentValue={value as GpuField<boolean>}
            onChange={handleChange}
            ref={ref as Ref<HTMLSelectElement>}
          />
        );
      } else if (inputType === 'enum') {
        return (
          <GpuEnumFieldInput
            field={field}
            value={value as GpuField<string>}
            parentValue={parentValue as GpuField<string>}
            onChange={handleChange}
            ref={ref as Ref<HTMLSelectElement>}
          />
        );
      } else {
        return (
          <GpuStringFieldInput
            field={field}
            value={value as GpuField<string>}
            parentValue={parentValue as GpuField<string>}
            onChange={handleChange}
            ref={ref as Ref<HTMLInputElement>}
          />
        );
      }
    }, [field, handleChange, inputType, ref, value, parentValue]);

    return (
      <div className="flex flex-col">
        {renderInput()}
        <div className="flex gap-4 items-end justify-end text-xs">
          <Checkbox
            value={value?.meta?.autoUpdate === true}
            onChange={handleAutoUpdateChange}
          >
            Auto Update
          </Checkbox>
        </div>
      </div>
    );
  },
);
GpuFieldInput.displayName = 'GpuFieldInput';
